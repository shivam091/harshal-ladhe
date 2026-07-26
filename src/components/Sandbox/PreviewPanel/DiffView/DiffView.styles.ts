import { styled } from "@linaria/react";
import { opaqueBgCss } from "@/components/common.styles";

// Shown when the active file has no original version to compare against, or hasn't changed from it.
export const Empty = styled.p`
  padding: 1rem;
  margin: 0;
  color: var(--color-fg-success);
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: var(--sandbox-editor-font-size);
`;

// Scrollable container for the whole Diff tab, so a diff that grows past it can still be viewed in full.
export const Wrapper = styled.div`
  block-size: 100%;
  margin: 0;
  padding: 0.5rem;
  overflow: auto;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: var(--sandbox-editor-font-size);
  line-height: 1.6;
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
  padding-inline: 0.5rem;
  padding-block-end: 0.1875rem;
  margin-block-start: 0.5rem;
  color: var(--color-fg-accent);
  white-space: pre;
  font-size: 0.75rem;
`;

/*
  One full pass over the file's rows/headers/gap-buttons, sized to the widest line across the whole
  pass, so every row's highlight spans the full scroll width rather than stopping at its own text.
*/
export const DiffContent = styled.div`
  display: grid;
  grid-template-columns: minmax(max-content, 1fr);
  min-inline-size: 100%;
  inline-size: max-content;
`;

/*
  Coloured via [data-type] with the same treatment as the gutter popup's rows, so both readouts of
  the same diff look identical.
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
    background-image: ${opaqueBgCss("var(--color-code-syntax-deleted-bg)")};
    color: var(--color-code-syntax-deleted-text);
  }

  &[data-type="added"] {
    border-inline-start-color: var(--color-code-syntax-inserted-text);
    background-image: ${opaqueBgCss("var(--color-code-syntax-inserted-bg)")};
    color: var(--color-code-syntax-inserted-text);
  }

  &[data-type="context"] {
    color: var(--color-fg-muted);
  }

  /*
    Revealed rows get a neutral tint, distinct from the plain context rows already shown around
    every change.
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
  padding-inline-end: 0.25rem;
  text-align: end;
  color: var(--color-fg-faint);
  user-select: none;
`;

// The leading +/-/blank column, kept the same width regardless of which so text stays aligned across row types.
export const Marker = styled.span`
  flex-shrink: 0;
  inline-size: 2ch;
  padding-inline-start: 0.25rem;
  font-weight: 700;
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

// Highlights just the words that changed within a replaced-line pair, on top of the row's whole-line tint.
export const WordChanged = styled.span`
  color: var(--color-code-syntax-changed-text) !important;
`;

// Old and new side by side, scroll-synced so the two stay aligned.
export const SplitPanes = styled.div`
  display: flex;
  align-items: stretch;
  block-size: 100%;
`;

// Scrolls independently unless locked to its partner pane.
export const SplitPane = styled.div`
  flex: 1;
  min-inline-size: 0;
  overflow-x: auto;
`;

// The fixed-width line between SplitPanes' two panes.
export const SplitDivider = styled.div`
  flex-shrink: 0;
  inline-size: 0.0625rem;
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
  gap: 0.25rem;
  inline-size: 100%;
  padding-block: 0.1875rem;
  padding-inline: 0.5rem;
  border: none;
  background: var(--color-bg-muted);
  color: var(--color-fg-accent);
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  text-align: start;
  cursor: pointer;

  &:hover {
    background: var(--color-bg-neutral-muted);
  }
`;
