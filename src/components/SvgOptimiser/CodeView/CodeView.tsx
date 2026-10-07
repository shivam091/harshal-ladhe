"use client";

import { useMemo, useState } from "react";
import type { JSX } from "react";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { ArrowDownIcon } from "@/components/Icon";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import { diffLines, downloadText, foldUnchanged, optimisedFileName } from "@/components/SvgOptimiser/SvgOptimiser.utils";
import { SectionCard, PanelTitle, HintText, BrassButton } from "@/components/SvgOptimiser/SvgOptimiser.styles";
import { HeaderRow, ModeGroup, ModeLegend, ModeOption, ModeInput, WrappingCode, DiffList, DiffRowItem, DiffSummary, HiddenText } from "@/components/SvgOptimiser/CodeView/CodeView.styles";
import type { CodeViewMode, CodeViewProps } from "@/components/SvgOptimiser/SvgOptimiser.types";

// The two views, in tab order.
const MODES: Array<{ value: CodeViewMode; label: string }> = [
  { value: "output", label: "Optimised" },
  { value: "diff", label: "Diff" }
];

// Gutter marker per diff row kind — the character carries the meaning as well as the tint.
const MARKERS = { same: " ", added: "+", removed: "−", fold: "⋯" } as const;

/*
  The dispatch desk: the optimised markup, highlighted, with copy and download — or a line diff of
  the original against it. Both sides of the diff are pretty-printed one element per line first,
  so a minified result still diffs element by element rather than as one changed line.
*/
export default function CodeView({ state, result }: CodeViewProps): JSX.Element {
  const [mode, setMode] = useState<CodeViewMode>("output");
  const [copyTrigger, setCopyTrigger] = useState(0);
  const html = useHighlightedCode(result.output, "xml");
  const diff = useMemo(() => (mode === "diff" && !result.error ? diffLines(result.prettyBefore, result.prettyAfter) : null), [mode, result]);
  const rows = useMemo(() => (diff ? foldUnchanged(diff) : []), [diff]);
  const added = diff?.filter((line) => line.kind === "added").length ?? 0;
  const removed = diff?.filter((line) => line.kind === "removed").length ?? 0;
  const fileName = optimisedFileName(state.fileName);

  return (
    <>
      <SectionCard>
        <HeaderRow>
          <PanelTitle data-form="P-99">Dispatch</PanelTitle>
          <ModeGroup>
            <ModeLegend>Code view</ModeLegend>
            {MODES.map((option) => (
              <ModeOption key={option.value}>
                <ModeInput type="radio" name="svg-optimiser-code-mode" checked={mode === option.value} onChange={() => setMode(option.value)} />
                <span>{option.label}</span>
              </ModeOption>
            ))}
          </ModeGroup>
          <BrassButton type="button" disabled={Boolean(result.error)} onClick={() => downloadText(fileName, result.output)}>
            <ArrowDownIcon size={14} />
            Download {fileName}
          </BrassButton>
        </HeaderRow>

        {result.error ? (
          <HintText>Fix the error in the parcel contents to see the optimised markup here.</HintText>
        ) : mode === "output" ? (
          <WrappingCode>
            <CodeBlockWrapper>
              <CopyButton code={result.output} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
              <Pre tabIndex={0} role="region" aria-label={`Optimised ${fileName}`} data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
              <Shimmer trigger={copyTrigger} />
            </CodeBlockWrapper>
          </WrappingCode>
        ) : diff === null ? (
          <HintText>This file is too large to diff line by line — the optimised markup is under the Optimised tab.</HintText>
        ) : (
          <>
            <DiffSummary>
              {removed} line{removed === 1 ? "" : "s"} removed, {added} added (both sides laid out one element per line)
            </DiffSummary>
            <DiffList tabIndex={0} aria-label="Line diff of the original against the optimised SVG">
              {rows.map((row, index) =>
                row.kind === "fold" ? (
                  <DiffRowItem key={index} data-kind="fold" data-marker={MARKERS.fold}>
                    {row.count} unchanged line{row.count === 1 ? "" : "s"}
                  </DiffRowItem>
                ) : (
                  <DiffRowItem key={index} data-kind={row.kind} data-marker={MARKERS[row.kind]}>
                    <span>
                      {row.kind !== "same" && <HiddenText>{row.kind === "added" ? "Added: " : "Removed: "}</HiddenText>}
                      {row.text}
                    </span>
                  </DiffRowItem>
                )
              )}
            </DiffList>
          </>
        )}
      </SectionCard>
    </>
  );
}

CodeView.displayName = "CodeView";
