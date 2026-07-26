import { clamp } from "@/utils/number";

/*
  Pure line-diff engine — no CodeMirror or React imports, so both the CodeMirror diff gutter
  (diff-gutter.ts, per-line hover/click popup) and the full-file Diff tab (DiffView.tsx, a plain
  unified-diff readout) can consume it directly.
*/

// One contiguous run of changed lines, in document order — mirrors a single unified-diff hunk.
export interface DiffHunk {
  // Original lines removed at this point — empty for a pure insertion.
  origLines: string[];
  // Current lines added/changed at this point — empty for a pure deletion.
  curLines: string[];
  /*
    1-based line in the ORIGINAL file this hunk starts at: its own first removed line if it
    removed anything, otherwise the original line immediately following the insertion point —
    clamped to the document's last line if the insertion point runs off the end of the file.
  */
  origFrom: number;
  /*
    1-based line in the CURRENT file this hunk starts at: its own first added line if it added
    or changed anything, otherwise the current line immediately following a pure deletion —
    clamped to the document's last line if the deletion runs off the end of the file.
  */
  curFrom: number;
}

/*
  LCS length table between two line arrays, filled bottom-up so a forward walk from (0,0) can
  backtrack an edit script — see diffLines below.
*/
function buildLcsTable(original: string[], current: string[]): number[][] {
  const table: number[][] = Array.from({ length: original.length + 1 }, () =>
    new Array<number>(current.length + 1).fill(0)
  );

  for (let i = original.length - 1; i >= 0; i--) {
    for (let j = current.length - 1; j >= 0; j--) {
      table[i][j] =
        original[i] === current[j]
          ? table[i + 1][j + 1] + 1
          : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }

  return table;
}

/*
  Collapses whitespace runs to a single space and trims the ends, so two lines that differ only in
  indentation/trailing spaces compare equal under diffLines' ignoreWhitespace — comparison only,
  never what's rendered.
*/
function normalizeForCompare(line: string): string {
  return line.replace(/\s+/g, " ").trim();
}

/*
  Line-level diff between a file's original and current content — returns one hunk per contiguous
  run of changed lines. ignoreWhitespace (matching `git diff -w`) compares lines loosely via
  normalizeForCompare, while every hunk still carries the ORIGINAL, unnormalized text.
*/
export function diffLines(original: string[], current: string[], ignoreWhitespace = false): DiffHunk[] {
  const compareOriginal = ignoreWhitespace ? original.map(normalizeForCompare) : original;
  const compareCurrent = ignoreWhitespace ? current.map(normalizeForCompare) : current;
  const lcs = buildLcsTable(compareOriginal, compareCurrent);
  const hunks: DiffHunk[] = [];

  let origLines: string[] = [];
  let curLines: string[] = [];
  let origFrom = 0;
  let curFrom = 0;

  function flush() {
    if (origLines.length === 0 && curLines.length === 0) return;
    hunks.push({
      origLines,
      curLines,
      origFrom: clamp(origFrom, 1, Math.max(original.length, 1)),
      curFrom: clamp(curFrom, 1, Math.max(current.length, 1))
    });
    origLines = [];
    curLines = [];
  }

  let i = 0;
  let j = 0;
  while (i < original.length || j < current.length) {
    if (i < original.length && j < current.length && compareOriginal[i] === compareCurrent[j]) {
      flush();
      i++;
      j++;
      continue;
    }

    if (origLines.length === 0 && curLines.length === 0) {
      origFrom = i + 1;
      curFrom = j + 1;
    }

    /*
      Prefers whichever side keeps the backtrack on the LCS's own path — ties break toward inserting
      first, so a pure replacement reads as "-old" then "+new".
    */
    const takeInsert = j < current.length && (i >= original.length || lcs[i][j + 1] >= lcs[i + 1][j]);
    if (takeInsert) {
      curLines.push(current[j]);
      j++;
    } else {
      origLines.push(original[i]);
      i++;
    }
  }
  flush();

  return hunks;
}

/*
  Line-number range a hunk covers in each file, for a unified-diff header — `count` is 0 (not 1) for a pure
  insertion/deletion, matching git's own convention.
*/
export interface HunkRange {
  oldStart: number;
  oldCount: number;
  newStart: number;
  newCount: number;
}

/*
  A pure insertion/deletion has 0 lines on the empty side, anchored one line before the insertion/deletion
  point (0 itself if that point is the very start of the file) — the same convention `git diff`'s own unified
  format uses.
*/
export function hunkRange(hunk: DiffHunk): HunkRange {
  return {
    oldStart: hunk.origLines.length === 0 ? Math.max(hunk.origFrom - 1, 0) : hunk.origFrom,
    oldCount: hunk.origLines.length,
    newStart: hunk.curLines.length === 0 ? Math.max(hunk.curFrom - 1, 0) : hunk.curFrom,
    newCount: hunk.curLines.length
  };
}

/*
  Renders a `HunkRange` as a real unified-diff header, e.g. "@@ -5,10 +5,12 @@" — a side's count is omitted
  when it's exactly 1, matching `git diff`.
*/
export function formatHunkHeader({ oldStart, oldCount, newStart, newCount }: HunkRange): string {
  const oldSide = oldCount === 1 ? `${oldStart}` : `${oldStart},${oldCount}`;
  const newSide = newCount === 1 ? `${newStart}` : `${newStart},${newCount}`;
  return `@@ -${oldSide} +${newSide} @@`;
}

/*
  One rendered line of a unified diff: unchanged context (present, at these line numbers, in both
  files), a removed original line, or an added current line. `pairedText` is set on a removed/added
  row only when it's one half of a same-position "replaced line" pair within its hunk (see
  pairedLineText) — the counterpart text diffLineWords needs to compute which words within the
  line actually changed, e.g. `git diff --color-words`'s inline highlighting.
*/
export type DiffRow =
  | { type: "context"; text: string; oldLine: number; newLine: number }
  | { type: "removed"; text: string; oldLine: number; pairedText?: string }
  | { type: "added"; text: string; newLine: number; pairedText?: string };

/*
  Pairs each removed line with the added line at the same position within `hunk` (and vice versa)
  — only lines within min(origLines.length, curLines.length) have a counterpart; the rest is a
  pure removal/addition with nothing to pair against, so word-level diffing doesn't apply to it.
*/
export function pairedLineText(hunk: DiffHunk, side: "removed" | "added", index: number): string | undefined {
  const pairCount = Math.min(hunk.origLines.length, hunk.curLines.length);
  if (index >= pairCount) return undefined;
  return side === "removed" ? hunk.curLines[index] : hunk.origLines[index];
}

/*
  One "@@ ... @@" section of a full unified diff — a hunk (or several merged together, see buildUnifiedDiff)
  plus its surrounding context rows.
*/
export interface UnifiedDiffBlock {
  header: HunkRange;
  rows: DiffRow[];
}

function hunkOldEnd(hunk: DiffHunk): number {
  return hunk.origFrom + hunk.origLines.length - 1;
}

function hunkNewEnd(hunk: DiffHunk): number {
  return hunk.curFrom + hunk.curLines.length - 1;
}

/*
  Builds one block's rows — leading context, each hunk's own -/+ lines with the unchanged gaps between them
  filled in as context, then trailing context — for hunks[firstIdx..lastIdx] inclusive.
*/
function buildBlock(
  hunks: DiffHunk[],
  firstIdx: number,
  lastIdx: number,
  original: string[],
  current: string[],
  contextLines: number
): UnifiedDiffBlock {
  const first = hunks[firstIdx];
  const last = hunks[lastIdx];

  const blockOldStart = Math.max(1, first.origFrom - contextLines);
  const blockOldEnd = Math.min(original.length, hunkOldEnd(last) + contextLines);
  const blockNewStart = Math.max(1, first.curFrom - contextLines);
  const blockNewEnd = Math.min(current.length, hunkNewEnd(last) + contextLines);

  const rows: DiffRow[] = [];
  let cursorOld = blockOldStart;
  let cursorNew = blockNewStart;

  /*
    Context lines are identical in both files, so either array can supply the text — `current` is used
    throughout for consistency.
  */
  function pushContextThrough(throughOld: number, throughNew: number) {
    while (cursorOld <= throughOld && cursorNew <= throughNew) {
      rows.push({ type: "context", text: current[cursorNew - 1], oldLine: cursorOld, newLine: cursorNew });
      cursorOld++;
      cursorNew++;
    }
  }

  for (let idx = firstIdx; idx <= lastIdx; idx++) {
    const hunk = hunks[idx];
    pushContextThrough(hunk.origFrom - 1, hunk.curFrom - 1);

    hunk.origLines.forEach((line, index) => {
      rows.push({ type: "removed", text: line, oldLine: cursorOld, pairedText: pairedLineText(hunk, "removed", index) });
      cursorOld++;
    });
    hunk.curLines.forEach((line, index) => {
      rows.push({ type: "added", text: line, newLine: cursorNew, pairedText: pairedLineText(hunk, "added", index) });
      cursorNew++;
    });
  }

  pushContextThrough(blockOldEnd, blockNewEnd);

  return {
    header: {
      oldStart: blockOldStart,
      oldCount: blockOldEnd - blockOldStart + 1,
      newStart: blockNewStart,
      newCount: blockNewEnd - blockNewStart + 1
    },
    rows
  };
}

/*
  One contiguous run of hunk indices [start, end] (inclusive) whose context padding would otherwise overlap or touch —
  shared by buildUnifiedDiff and buildSplitDiff, which only differ in how they render each group's rows (a flat list
  vs. paired columns).
*/
interface HunkGroup {
  start: number;
  end: number;
}

/*
  Groups diffLines' hunks into the runs buildUnifiedDiff/buildSplitDiff each render as one "@@"
  block — merges any neighboring hunks whose `contextLines` padding would otherwise overlap or
  touch, the same rule real diff tools use to avoid printing two blocks with a one-line gap
  between them.
*/
function groupHunks(hunks: DiffHunk[], contextLines: number): HunkGroup[] {
  const groups: HunkGroup[] = [];
  let groupStart = 0;

  for (let i = 1; i <= hunks.length; i++) {
    /*
      The unchanged span between this hunk and the next, measured in either file's numbering — it's
      the same length in both, since only the hunks themselves change line counts. Infinity past the
      last hunk so the final group always closes.
    */
    const gap = i < hunks.length ? hunks[i].curFrom - (hunks[i - 1].curFrom + hunks[i - 1].curLines.length) : Infinity;
    if (gap > contextLines * 2) {
      groups.push({ start: groupStart, end: i - 1 });
      groupStart = i;
    }
  }

  return groups;
}

/*
  Full unified diff between a file's original and current content: every hunk from diffLines,
  padded with up to `contextLines` unchanged lines on each side (default 3, matching `git diff`'s
  own default) and merged with any neighbor whose padding would otherwise overlap or touch (see
  groupHunks). ignoreWhitespace forwards to diffLines, matching `git diff -w`.
*/
export function buildUnifiedDiff(original: string[], current: string[], contextLines = 3, ignoreWhitespace = false): UnifiedDiffBlock[] {
  const hunks = diffLines(original, current, ignoreWhitespace);
  if (hunks.length === 0) return [];

  return groupHunks(hunks, contextLines).map((group) => buildBlock(hunks, group.start, group.end, original, current, contextLines));
}

/*
  One paired row of a split diff: the old-file cell and the new-file cell shown side by side — either
  is null when the other side has no counterpart at that position (a pure insertion/deletion), rendered
  as a blank cell.
*/
export interface SplitDiffRow {
  left: Extract<DiffRow, { type: "context" | "removed" }> | null;
  right: Extract<DiffRow, { type: "context" | "added" }> | null;
}

// One "@@ ... @@" section of a split diff — same header shape as UnifiedDiffBlock, paired rows instead of a flat list.
export interface SplitDiffBlock {
  header: HunkRange;
  rows: SplitDiffRow[];
}

/*
  Builds one split-diff block's rows — same leading/trailing context and hunk traversal as
  buildBlock, but each hunk's origLines/curLines are paired by position (matching pairedLineText's
  own pairing) instead of listed removed-then-added, so a replaced line lands on one row with old
  on the left and new on the right. A side with no counterpart at that position (a pure
  insertion/deletion) gets null.
*/
function buildSplitBlock(
  hunks: DiffHunk[],
  firstIdx: number,
  lastIdx: number,
  original: string[],
  current: string[],
  contextLines: number
): SplitDiffBlock {
  const first = hunks[firstIdx];
  const last = hunks[lastIdx];

  const blockOldStart = Math.max(1, first.origFrom - contextLines);
  const blockOldEnd = Math.min(original.length, hunkOldEnd(last) + contextLines);
  const blockNewStart = Math.max(1, first.curFrom - contextLines);
  const blockNewEnd = Math.min(current.length, hunkNewEnd(last) + contextLines);

  const rows: SplitDiffRow[] = [];
  let cursorOld = blockOldStart;
  let cursorNew = blockNewStart;

  function pushContextThrough(throughOld: number, throughNew: number) {
    while (cursorOld <= throughOld && cursorNew <= throughNew) {
      const row: DiffRow = { type: "context", text: current[cursorNew - 1], oldLine: cursorOld, newLine: cursorNew };
      rows.push({ left: row, right: row });
      cursorOld++;
      cursorNew++;
    }
  }

  for (let idx = firstIdx; idx <= lastIdx; idx++) {
    const hunk = hunks[idx];
    pushContextThrough(hunk.origFrom - 1, hunk.curFrom - 1);

    const pairCount = Math.max(hunk.origLines.length, hunk.curLines.length);
    for (let index = 0; index < pairCount; index++) {
      const origText = hunk.origLines[index];
      const curText = hunk.curLines[index];
      const left: SplitDiffRow["left"] =
        origText == null ? null : { type: "removed", text: origText, oldLine: cursorOld, pairedText: pairedLineText(hunk, "removed", index) };
      const right: SplitDiffRow["right"] =
        curText == null ? null : { type: "added", text: curText, newLine: cursorNew, pairedText: pairedLineText(hunk, "added", index) };
      rows.push({ left, right });
      if (left) cursorOld++;
      if (right) cursorNew++;
    }
  }

  pushContextThrough(blockOldEnd, blockNewEnd);

  return {
    header: {
      oldStart: blockOldStart,
      oldCount: blockOldEnd - blockOldStart + 1,
      newStart: blockNewStart,
      newCount: blockNewEnd - blockNewStart + 1
    },
    rows
  };
}

/*
  Split-view counterpart to buildUnifiedDiff — same hunk grouping (groupHunks) and context padding,
  rendered as old/new column pairs (buildSplitBlock) instead of a flattened row list.
  ignoreWhitespace forwards to diffLines, same as buildUnifiedDiff.
*/
export function buildSplitDiff(original: string[], current: string[], contextLines = 3, ignoreWhitespace = false): SplitDiffBlock[] {
  const hunks = diffLines(original, current, ignoreWhitespace);
  if (hunks.length === 0) return [];

  return groupHunks(hunks, contextLines).map((group) => buildSplitBlock(hunks, group.start, group.end, original, current, contextLines));
}

// Total added/removed line counts across a file — e.g. for a "+12 -3" stat badge.
export interface DiffStats {
  added: number;
  removed: number;
}

/*
  Independent of contextLines, since it only looks at what actually changed — shared by
  PreviewPanel's tab badge and DiffView's own header (PreviewPanel computes it once and passes it
  down, rather than each computing its own copy). ignoreWhitespace forwards to diffLines, so the
  badge/header count drops for a file whose only changes are whitespace once hideWhitespaceDiff is
  on, matching what DiffView itself renders.
*/
export function diffStats(original: string[], current: string[], ignoreWhitespace = false): DiffStats {
  const hunks = diffLines(original, current, ignoreWhitespace);
  return hunks.reduce(
    (stats, hunk) => ({ added: stats.added + hunk.curLines.length, removed: stats.removed + hunk.origLines.length }),
    { added: 0, removed: 0 }
  );
}

/*
  Plain context rows for a contiguous unchanged span, read directly off `current` (identical to
  `original` over this range by definition) — no diffing involved. Used to reveal a span
  buildUnifiedDiff collapsed between/around blocks, without re-running the diff over it.
*/
export function contextRows(current: string[], oldStart: number, newStart: number, count: number): DiffRow[] {
  const rows: DiffRow[] = [];
  for (let offset = 0; offset < count; offset++) {
    rows.push({ type: "context", text: current[newStart - 1 + offset], oldLine: oldStart + offset, newLine: newStart + offset });
  }
  return rows;
}

function serializeRow(row: DiffRow): string {
  const prefix = row.type === "added" ? "+" : row.type === "removed" ? "-" : " ";
  return prefix + row.text;
}

/*
  Renders one block back into real unified-diff text (header + prefixed rows) — what "copy diff" hands to
  the clipboard.
*/
export function serializeBlock(block: UnifiedDiffBlock): string {
  return [formatHunkHeader(block.header), ...block.rows.map(serializeRow)].join("\n");
}

/*
  Every block's text, one after another — matches how `git diff` itself concatenates hunks, with no b
  lank line between them.
*/
export function serializeUnifiedDiff(blocks: UnifiedDiffBlock[]): string {
  return blocks.map(serializeBlock).join("\n");
}

/*
  Splits a line into words, whitespace runs, and punctuation runs — the unit diffLineWords compares, instead
  of whole lines.
*/
function tokenizeForWordDiff(text: string): string[] {
  return text.match(/\w+|\s+|[^\w\s]+/g) ?? [];
}

// One contiguous, character-offset range within a single line's text.
export interface CharRange {
  from: number;
  to: number;
}

/*
  Reconstructs, for one side of a token-level diff, the character-offset ranges (within that side's own text)
  that actually changed.
*/
function changedRangesForSide(tokens: string[], hunks: DiffHunk[], side: "orig" | "cur"): CharRange[] {
  const ranges: CharRange[] = [];
  let tokenCursor = 0;
  let charCursor = 0;

  for (const hunk of hunks) {
    const changeTokens = side === "orig" ? hunk.origLines : hunk.curLines;
    const from = (side === "orig" ? hunk.origFrom : hunk.curFrom) - 1;

    for (; tokenCursor < from; tokenCursor++) charCursor += tokens[tokenCursor].length;

    if (changeTokens.length > 0) {
      const length = changeTokens.reduce((sum, token) => sum + token.length, 0);
      ranges.push({ from: charCursor, to: charCursor + length });
      charCursor += length;
      tokenCursor += changeTokens.length;
    }
  }

  return ranges;
}

/*
  Word-level diff between two versions of the SAME line (a "replaced" pair — see pairedLineText):
  the character-offset ranges, within each side's own text, that actually changed. Mirrors GitHub's
  (and `git diff --color-words`'s) inline highlighting — changing `foo(a, b)` to `foo(a, c)` marks
  just `b`/`c`, not the whole line. Reuses diffLines itself (it only cares about array-element
  equality, so it works identically over word tokens as it does over whole lines).
*/
export function diffLineWords(oldText: string, newText: string): { oldChanged: CharRange[]; newChanged: CharRange[] } {
  const oldTokens = tokenizeForWordDiff(oldText);
  const newTokens = tokenizeForWordDiff(newText);
  const hunks = diffLines(oldTokens, newTokens);

  return {
    oldChanged: changedRangesForSide(oldTokens, hunks, "orig"),
    newChanged: changedRangesForSide(newTokens, hunks, "cur")
  };
}
