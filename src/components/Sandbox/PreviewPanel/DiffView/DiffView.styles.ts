import { styled } from "@linaria/react";

// Shown when the active file has no original version to compare against, or hasn't changed from it.
export const Empty = styled.p`
  padding: var(--space-base);
  margin: var(--space-none);
  color: var(--color-fg-success);
  font-family: var(--font-stack-monospace);
  font-size: var(--sandbox-editor-font-size);
`;

// Scrollable container for the whole Diff tab, so a diff that grows past it can still be viewed in full.
export const Wrapper = styled.div`
  block-size: 100%;
  margin: var(--space-none);
  padding: var(--space-sm);
  overflow: auto;
  font-family: var(--font-stack-monospace);
  font-size: var(--sandbox-editor-font-size);
  line-height: var(--line-height-code);
`;

/*
  Groups one block's rows/headers/gap-button without introducing its own box, so they lay out as direct
  items of DiffContent's grid.
*/
export const Block = styled.div`
  display: contents;
`;

// The "@@ -a,b +c,d @@" line itself — muted, since it isn't a changed line, just a locator.
export const BlockHeader = styled.div`
  grid-column: 1 / -1;
  padding-inline: var(--space-sm);
  padding-block-end: var(--space-xxs);
  margin-block-start: var(--space-sm);
  color: var(--color-fg-accent);
  white-space: pre;
  font-size: var(--font-size-xs);
`;

/*
  One full pass over the file's rows/headers/gap-buttons, sized to the widest line across the whole
  pass — used once for the unified layout, and once per side for the split layout.
*/
export const DiffContent = styled.div`
  display: grid;
  grid-template-columns: minmax(max-content, 1fr);
  min-inline-size: 100%;
  inline-size: max-content;
`;

/*
  One diff row — two line-number columns (old/new) in unified mode, one in split mode (see
  SplitOldLine/SplitNewLine), a +/- marker column, then the line's text. Colored via [data-type],
  same red/green gradient-tinted treatment as the gutter popup's own rows (diff-gutter.styles.ts)
  so both readouts of the same diff look identical.
*/
export const Row = styled.div`
  display: flex;
  min-block-size: 1lh;
  border-inline-start-width: 3px !important;
  border-inline-start-style: solid;
  border-inline-start-color: transparent;
  white-space: pre;

  &[data-type="removed"] {
    border-inline-start-color: var(--color-code-syntax-deleted-text);
    background-image: linear-gradient(var(--color-code-syntax-deleted-bg), var(--color-code-syntax-deleted-bg));
    color: var(--color-code-syntax-deleted-text);
  }

  &[data-type="added"] {
    border-inline-start-color: var(--color-code-syntax-inserted-text);
    background-image: linear-gradient(var(--color-code-syntax-inserted-bg), var(--color-code-syntax-inserted-bg));
    color: var(--color-code-syntax-inserted-text);
  }

  &[data-type="context"] {
    color: var(--color-fg-muted);
  }

  /*
    Rows revealed via GapSection's "Show N unchanged lines" button — a neutral tint, distinct from the plain
    (unmarked) context rows already shown around every change.
  */
  &[data-expanded="true"] {
    background: var(--color-bg-neutral-muted);
  }

  /* A split-view column's blank filler row — the other column's line at this position is a pure insertion/deletion with no counterpart here. */
  &[data-empty="true"] {
    background: var(--color-bg-neutral-muted);
  }
`;

// One old/new line-number column — fixed width so every row's marker/text lines up regardless of digit count.
export const LineNumber = styled.span`
  flex-shrink: 0;
  inline-size: 4ch;
  padding-inline-end: var(--space-xs);
  text-align: end;
  color: var(--color-fg-faint);
  user-select: none;
`;

// The leading +/-/blank column, kept the same width regardless of which so text stays aligned across row types.
export const Marker = styled.span`
  flex-shrink: 0;
  inline-size: 2ch;
  padding-inline-start: var(--space-xs);
  font-weight: var(--font-weight-bold);
`;

/*
  The line's own text — a row of per-segment spans (highlightRow's output) so syntax classes and word-level diff
  emphasis can be applied per sub-range of the line.
*/
export const Text = styled.span`
  display: flex;
  flex: 1;
  min-inline-size: 0;
`;

/*
  Highlights the word(s) that actually changed within a replaced-line pair (diffLineWords, via highlightRow),
  layered on top of Row's own whole-line tint.
*/
export const WordChanged = styled.span`
  color: var(--color-code-syntax-changed-text) !important;
`;

/*
  Split view's two panes (old | new) side by side, plus SplitDivider between them. DiffView keeps
  their scroll positions in sync (see its own onScroll handlers) so the two sides stay aligned.
*/
export const SplitPanes = styled.div`
  display: flex;
  align-items: stretch;
  height: 100%;
`;

/*
  One side of a SplitPanes pair — see SplitPanes' own comment. Scrolls independently unless DiffView's
  onScroll handlers keep it locked to the other side.
*/
export const SplitPane = styled.div`
  flex: 1;
  min-inline-size: 0;
  overflow-x: auto;
`;

// The fixed-width line between SplitPanes' two panes.
export const SplitDivider = styled.div`
  flex-shrink: 0;
  inline-size: var(--border-width-default);
  background: var(--color-border-muted);
`;

/*
  A collapsed span of unchanged lines between (or around) blocks — click to reveal those lines as plain
  context rows, GitHub PR-diff style.
*/
export const ExpandGap = styled.button`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  inline-size: 100%;
  padding-block: var(--space-xxs);
  padding-inline: var(--space-sm);
  border: none;
  background: var(--color-bg-muted);
  color: var(--color-fg-accent);
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-xs);
  text-align: start;
  cursor: pointer;

  &:hover {
    background: var(--color-bg-neutral-muted);
  }
`;
