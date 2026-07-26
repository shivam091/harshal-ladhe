import { useMemo, useRef, useState, type JSX } from "react";
import { useSandpack } from "@codesandbox/sandpack-react";
import { useSandboxUIContext } from "@/hooks/use-sandbox-ui-context";
import {
  buildUnifiedDiff,
  buildSplitDiff,
  formatHunkHeader,
  contextRows,
  type DiffRow,
  type SplitDiffRow
} from "@/components/Sandbox/Editor/extensions/diff-engine";
import { createLineHighlighter, highlightRow, type LineHighlighter, type RenderSegment } from "@/components/Sandbox/Editor/extensions/diff-highlight";
import type { DiffViewProps } from "@/components/Sandbox/PreviewPanel/DiffView/DiffView.types";
import {
  Empty,
  Wrapper,
  Block,
  BlockHeader,
  Row,
  LineNumber,
  Marker,
  Text,
  WordChanged,
  ExpandGap,
  DiffContent,
  SplitPanes,
  SplitPane,
  SplitDivider
} from "@/components/Sandbox/PreviewPanel/DiffView/DiffView.styles";
import {
  CONTEXT_LINES,
  rowMarker,
  toSplitContextRow,
  gapBefore,
  EXPAND_ICON,
  EXPAND_LABEL,
  type Gap
} from "@/components/Sandbox/PreviewPanel/DiffView/DiffView.helpers";

/*
  Renders highlightRow's output as inline spans — shared by the unified row and both split-view cells,
  so word-level/syntax styling stays identical across view modes.
*/
function renderSegments(segments: RenderSegment[]): JSX.Element {
  return (
    <>
      {segments.map((segment, index) =>
        segment.changed ? (
          <WordChanged key={index} className={segment.classes}>
            {segment.text}
          </WordChanged>
        ) : (
          <span key={index} className={segment.classes}>
            {segment.text}
          </span>
        )
      )}
    </>
  );
}

/*
  One row of the unified diff view — old/new line-number columns, a +/-/blank marker, and the
  syntax+word-highlighted text.
*/
function DiffViewRow({
  row,
  origHighlighter,
  curHighlighter,
  expanded = false
}: {
  row: DiffRow;
  origHighlighter: LineHighlighter;
  curHighlighter: LineHighlighter;
  /*
    Marks a row revealed via GapSection's "Show N unchanged lines" button, so it can get its own
    neutral background — distinct from the plain context rows buildUnifiedDiff already shows
    around every change.
  */
  expanded?: boolean;
}): JSX.Element {
  const segments = highlightRow(row, origHighlighter, curHighlighter);

  return (
    <>
      <Row data-type={row.type} data-expanded={expanded || undefined}>
        <LineNumber>{row.type === "added" ? "" : row.oldLine}</LineNumber>
        <LineNumber>{row.type === "removed" ? "" : row.newLine}</LineNumber>
        <Marker>{rowMarker(row)}</Marker>
        <Text>{renderSegments(segments)}</Text>
      </Row>
    </>
  );
}

/*
  One line in the old-file column of a split row — same look as DiffViewRow, minus the
  (opposite-side) line-number column. Null renders a blank filler row (this position is a
  pure insertion, with no old-side counterpart).
*/
function SplitOldLine({
  cell,
  origHighlighter,
  curHighlighter,
  expanded = false
}: {
  cell: SplitDiffRow["left"];
  origHighlighter: LineHighlighter;
  curHighlighter: LineHighlighter;
  expanded?: boolean;
}): JSX.Element {
  if (!cell) return <Row data-empty="true" />;

  return (
    <>
      <Row data-type={cell.type} data-expanded={expanded || undefined}>
        <LineNumber>{cell.oldLine}</LineNumber>
        <Marker>{rowMarker(cell)}</Marker>
        <Text>{renderSegments(highlightRow(cell, origHighlighter, curHighlighter))}</Text>
      </Row>
    </>
  );
}

// The new-file counterpart to SplitOldLine — reads newLine instead of oldLine.
function SplitNewLine({
  cell,
  origHighlighter,
  curHighlighter,
  expanded = false
}: {
  cell: SplitDiffRow["right"];
  origHighlighter: LineHighlighter;
  curHighlighter: LineHighlighter;
  expanded?: boolean;
}): JSX.Element {
  if (!cell) return <Row data-empty="true" />;

  return (
    <>
      <Row data-type={cell.type} data-expanded={expanded || undefined}>
        <LineNumber>{cell.newLine}</LineNumber>
        <Marker>{rowMarker(cell)}</Marker>
        <Text>{renderSegments(highlightRow(cell, origHighlighter, curHighlighter))}</Text>
      </Row>
    </>
  );
}

/*
  A collapsed span's "Show N unchanged lines" button, or (once expanded) the revealed rows themselves — renderRows
  decides how those rows actually render.
*/
function GapSection({
  gap,
  expanded,
  onExpand,
  currentLines,
  renderRows
}: {
  gap: Gap;
  expanded: boolean;
  onExpand: () => void;
  currentLines: string[];
  /*
    Renders the revealed rows once expanded — DiffView passes a unified or split renderer depending on
    showSplitDiffView, so this component doesn't need to know which mode is active.
  */
  renderRows: (rows: DiffRow[]) => JSX.Element;
}): JSX.Element | null {
  if (gap.count === 0) return null;

  if (!expanded) {
    const ExpandIcon = EXPAND_ICON[gap.position];
    return (
      <>
        <ExpandGap type="button" onClick={onExpand} title={EXPAND_LABEL[gap.position]}>
          <ExpandIcon size={14} />
          Show {gap.count} unchanged line{gap.count === 1 ? "" : "s"}
        </ExpandGap>
      </>
    );
  }

  return renderRows(contextRows(currentLines, gap.oldStart, gap.newStart, gap.count));
}

/*
  Full diff (real "@@ -a,b +c,d @@" headers, context lines included, syntax + word-level
  highlighting, and expandable collapsed spans) for the active file — the Diff tab's counterpart to
  the gutter popup's per-hunk, no-context view (diff-gutter.ts). Both read the same algorithm from
  diff-engine.ts/diff-highlight.ts, just configured differently (contextLines, and whether
  surrounding context is shown at all). Renders unified or split layout depending on
  showSplitDiffView, and ignores whitespace-only changes when hideWhitespaceDiff is on — both from
  SandboxUIContext, toggled via PreviewPanel's own Diff-tab action buttons rather than anything in
  this component, so they stay reachable even through this component's own empty-diff branches.
*/
export default function DiffView({ originalFiles }: DiffViewProps): JSX.Element {
  const { sandpack } = useSandpack();
  const { activeTab, showSplitDiffView, hideWhitespaceDiff } = useSandboxUIContext();
  const [expandedGaps, setExpandedGaps] = useState<ReadonlySet<number>>(new Set());
  const oldPaneRef = useRef<HTMLDivElement>(null);
  const newPaneRef = useRef<HTMLDivElement>(null);
  /*
    Guards against the feedback loop a naive sync would cause: setting one pane's scroll position from
    the other's onScroll handler fires that pane's own onScroll too, which would otherwise bounce right
    back.
  */
  const isSyncingScroll = useRef(false);

  /*
    Mirrors oldPaneRef's scroll position onto newPaneRef, both axes, so the two panes stay aligned instead
    of scrolling independently.
  */
  function syncScrollFromOldPane() {
    if (isSyncingScroll.current || !oldPaneRef.current || !newPaneRef.current) return;
    isSyncingScroll.current = true;
    newPaneRef.current.scrollLeft = oldPaneRef.current.scrollLeft;
    newPaneRef.current.scrollTop = oldPaneRef.current.scrollTop;
    isSyncingScroll.current = false;
  }

  // The new-pane counterpart to syncScrollFromOldPane.
  function syncScrollFromNewPane() {
    if (isSyncingScroll.current || !oldPaneRef.current || !newPaneRef.current) return;
    isSyncingScroll.current = true;
    oldPaneRef.current.scrollLeft = newPaneRef.current.scrollLeft;
    oldPaneRef.current.scrollTop = newPaneRef.current.scrollTop;
    isSyncingScroll.current = false;
  }

  const originalEntry = originalFiles?.[sandpack.activeFile];
  const originalCode = originalEntry == null ? null : typeof originalEntry === "string" ? originalEntry : originalEntry.code;
  const currentCode = sandpack.files[sandpack.activeFile]?.code ?? "";
  const isActive = activeTab === "diff";

  const originalLines = useMemo(() => (originalCode ?? "").split("\n"), [originalCode]);
  const currentLines = useMemo(() => currentCode.split("\n"), [currentCode]);

  /*
    This pane stays mounted while another tab is active (see PreviewPanel's Pane comment), so
    without the isActive gate every one of these — the LCS diff, two from-scratch syntax parses,
    and the plain-text serialization — would otherwise redo itself on every keystroke whether or
    not anyone's looking at this tab. Gating on isActive means switching tabs can trigger one
    recompute even when the content hasn't changed since the last visit (activeTab is part of each
    memo's own dependency list), but that's a single recompute per switch, not per keystroke.
  */
  const unifiedBlocks = useMemo(
    () => (!isActive || originalCode == null ? null : buildUnifiedDiff(originalLines, currentLines, CONTEXT_LINES, hideWhitespaceDiff)),
    [isActive, originalCode, originalLines, currentLines, hideWhitespaceDiff]
  );
  /*
    Only built while split mode is actually on — unifiedBlocks alone covers the copy-diff text and
    the empty-state checks below regardless of view mode.
  */
  const splitBlocks = useMemo(
    () => (!isActive || originalCode == null || !showSplitDiffView ? null : buildSplitDiff(originalLines, currentLines, CONTEXT_LINES, hideWhitespaceDiff)),
    [isActive, originalCode, originalLines, currentLines, hideWhitespaceDiff, showSplitDiffView]
  );
  const origHighlighter = useMemo(
    () => (isActive ? createLineHighlighter(originalCode ?? "", sandpack.activeFile) : null),
    [isActive, originalCode, sandpack.activeFile]
  );
  const curHighlighter = useMemo(
    () => (isActive ? createLineHighlighter(currentCode, sandpack.activeFile) : null),
    [isActive, currentCode, sandpack.activeFile]
  );

  function expandGap(beforeIndex: number) {
    setExpandedGaps((current) => new Set(current).add(beforeIndex));
  }

  if (unifiedBlocks == null) {
    return (
      <>
        <Empty>No original version of {sandpack.activeFile} to compare against.</Empty>
      </>
    );
  }

  if (unifiedBlocks.length === 0) {
    return (
      <>
        <Empty>
          {hideWhitespaceDiff
            ? `No non-whitespace changes in ${sandpack.activeFile}.`
            : `No changes in ${sandpack.activeFile}.`}
        </Empty>
      </>
    );
  }

  // Unreachable in practice — narrows for TypeScript so call sites below don't need their own non-null assertions.
  if (!origHighlighter || !curHighlighter) {
    return <></>;
  }

  // Rebound to their own non-null consts so the nested render functions below don't each need their own `!` assertion.
  const orig = origHighlighter;
  const cur = curHighlighter;
  const blocks = unifiedBlocks;

  function renderUnifiedRows(rows: DiffRow[]): JSX.Element {
    return (
      <>
        {rows.map((row, index) => (
          <DiffViewRow key={index} row={row} origHighlighter={orig} curHighlighter={cur} expanded />
        ))}
      </>
    );
  }

  /*
    One full DiffContent pass — every block's GapSection/BlockHeader/rows — shared by the unified
    render and by each split pane (called once per side below). `renderMainRows`/`renderGapRows`
    are the only per-call-site pieces (a given block's own rows vs. one side's cells of a split
    row); everything else — block/gap iteration, headers — is identical either way. Reads
    unifiedBlocks/expandedGaps/etc. from the enclosing closure, same as renderUnifiedRows above.
  */
  function renderDiffContent(renderMainRows: (blockIndex: number) => JSX.Element[], renderGapRows: (rows: DiffRow[]) => JSX.Element): JSX.Element {
    return (
      <>
        <DiffContent>
          {blocks.map((block, index) => (
            <Block key={index}>
              <GapSection
                gap={gapBefore(blocks, index, originalLines.length)}
                expanded={expandedGaps.has(index)}
                onExpand={() => expandGap(index)}
                currentLines={currentLines}
                renderRows={renderGapRows}
              />
              <BlockHeader>{formatHunkHeader(block.header)}</BlockHeader>
              {renderMainRows(index)}
            </Block>
          ))}
          <GapSection
            gap={gapBefore(blocks, blocks.length, originalLines.length)}
            expanded={expandedGaps.has(blocks.length)}
            onExpand={() => expandGap(blocks.length)}
            currentLines={currentLines}
            renderRows={renderGapRows}
          />
        </DiffContent>
      </>
    );
  }

  if (showSplitDiffView) {
    // Unreachable in practice — rebinding to a non-null const so the two panes below don't each need their own `!` assertion.
    if (!splitBlocks) return <></>;
    const splits = splitBlocks;

    return (
      <>
        <Wrapper>
          <SplitPanes>
            <SplitPane ref={oldPaneRef} onScroll={syncScrollFromOldPane}>
              {renderDiffContent(
                (blockIndex) =>
                  splits[blockIndex].rows.map((row, rowIndex) => (
                    <SplitOldLine key={rowIndex} cell={row.left} origHighlighter={orig} curHighlighter={cur} />
                  )),
                (rows) => (
                  <>
                    {rows.map((row, index) => (
                      <SplitOldLine key={index} cell={toSplitContextRow(row).left} origHighlighter={orig} curHighlighter={cur} expanded />
                    ))}
                  </>
                )
              )}
            </SplitPane>
            <SplitDivider />
            <SplitPane ref={newPaneRef} onScroll={syncScrollFromNewPane}>
              {renderDiffContent(
                (blockIndex) =>
                  splits[blockIndex].rows.map((row, rowIndex) => (
                    <SplitNewLine key={rowIndex} cell={row.right} origHighlighter={orig} curHighlighter={cur} />
                  )),
                (rows) => (
                  <>
                    {rows.map((row, index) => (
                      <SplitNewLine key={index} cell={toSplitContextRow(row).right} origHighlighter={orig} curHighlighter={cur} expanded />
                    ))}
                  </>
                )
              )}
            </SplitPane>
          </SplitPanes>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      <Wrapper>
        {renderDiffContent(
          (blockIndex) =>
            blocks[blockIndex].rows.map((row, rowIndex) => (
              <DiffViewRow key={rowIndex} row={row} origHighlighter={orig} curHighlighter={cur} />
            )),
          renderUnifiedRows
        )}
      </Wrapper>
    </>
  );
}

DiffView.displayName = "DiffView";
