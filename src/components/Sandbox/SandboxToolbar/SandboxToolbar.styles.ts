import { css } from "@linaria/core";

/*
  Scrolls horizontally instead of wrapping or squishing buttons as actions are added. A plain class
  rather than `styled()`, since wrapping Radix's Toolbar.Root would pull it into Linaria's
  static-eval sandbox, which can't import the Node builtins Radix references.
*/
export const rootClass = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
  max-inline-size: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-inline: contain;
  // Keeps the row's scrollable content from ever affecting the page's own layout/scroll width.
  contain: layout;
  /*
    Leaves room for the reset button's hold-progress dots (5px), which float above its icon and
    would otherwise be clipped by overflow-y: hidden; the matching negative margin keeps the row's
    footprint unchanged.
  */
  padding-inline: 0.25rem;
  padding-block: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-muted) transparent;

  &::-webkit-scrollbar {
    block-size: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--color-border-muted);
    border-radius: 0.375rem;
  }

  & > * {
    flex-shrink: 0;
  }
`;

/*
  Vertical divider between the toolbar's button groups (editor actions / sandbox actions / meta) —
  reused for every Toolbar.Separator, not just one.
*/
export const separatorClass = css`
  inline-size: 1px;
  block-size: 1.25rem;
  margin-inline: 0.125rem;
  background: var(--color-border-muted);
`;
