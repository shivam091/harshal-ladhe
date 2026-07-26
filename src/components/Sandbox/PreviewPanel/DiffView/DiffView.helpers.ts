import { FoldUpIcon, FoldDownIcon, UnfoldIcon } from "@/components/Icon";
import type { DiffRow, HunkRange, SplitDiffRow } from "@/components/Sandbox/Editor/extensions/diff-engine";

// How many unchanged lines to show on each side of a change — matches `git diff`'s own default.
export const CONTEXT_LINES = 3;

// A DiffRow's leading +/-/blank marker and which line-number column(s) it fills.
export function rowMarker(row: DiffRow): string {
  return row.type === "added" ? "+" : row.type === "removed" ? "-" : " ";
}

/*
  contextRows only ever returns "context"-typed rows, so pairing one with itself on both sides
  is always valid — used to expand a GapSection while showSplitDiffView is on.
*/
export function toSplitContextRow(row: DiffRow): SplitDiffRow {
  const contextRow = row as Extract<DiffRow, { type: "context" }>;
  return { left: contextRow, right: contextRow };
}

/*
  A span of unchanged lines a block-builder collapsed — before the first block, between two
  blocks, or after the last — identified by the 0-based index of the block it precedes
  (blocks.length for the trailing span). Shared by unified and split mode, since both group
  the same hunks (see groupHunks in diff-engine.ts).
*/
export interface Gap {
  beforeIndex: number;
  oldStart: number;
  newStart: number;
  count: number;
  /*
    Where this span sits relative to the blocks around it — "top"/"bottom" reveal rows above/below
    every change, "middle" sits between two changes (so expanding it reveals rows on both sides at
    once).
  */
  position: "top" | "middle" | "bottom";
}

/*
  Gap length only needs the OLD side's line count — it's identical to the NEW side's by definition,
  since only the hunks themselves ever change a span's length. Takes just each block's header, so
  the same helper works for both UnifiedDiffBlock[] and SplitDiffBlock[].
*/
export function gapBefore(blocks: { header: HunkRange }[], beforeIndex: number, originalLineCount: number): Gap {
  const previous = blocks[beforeIndex - 1]?.header;
  const next = blocks[beforeIndex]?.header;

  const oldStart = previous ? previous.oldStart + previous.oldCount : 1;
  const newStart = previous ? previous.newStart + previous.newCount : 1;
  const oldEndExclusive = next ? next.oldStart : originalLineCount + 1;
  const position = !previous ? "top" : !next ? "bottom" : "middle";

  return { beforeIndex, oldStart, newStart, count: Math.max(0, oldEndExclusive - oldStart), position };
}

// GitHub's own Octicon glyphs for each direction a collapsed span can reveal.
export const EXPAND_ICON: Record<Gap["position"], typeof FoldUpIcon> = {
  top: FoldUpIcon,
  bottom: FoldDownIcon,
  middle: UnfoldIcon
};

/*
  Hover tooltip per direction — matches the Octicon names themselves ("fold-up"/"fold-down"/"unfold")
  rather than repeating the button's own "Show N unchanged lines" text.
*/
export const EXPAND_LABEL: Record<Gap["position"], string> = {
  top: "Expand Up",
  bottom: "Expand Down",
  middle: "Expand All"
};
