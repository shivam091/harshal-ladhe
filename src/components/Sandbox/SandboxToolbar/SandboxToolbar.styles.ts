import { css } from "@linaria/core";

/*
  Row of toolbar action buttons in the sandbox header. A plain class (not `styled()`) applied
  via className to Radix's Toolbar.Root — wrapping that component with `styled()` here would
  pull it into linaria's static-eval sandbox, which can't import the Node builtins Radix's
  bundle references. Mirrors Tooltip.styles.ts's contentClass, applied the same way.
*/
// The toolbar's action row — scrolls horizontally instead of wrapping or squishing buttons as more actions are added.
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
    ResetButton's held-progress dots float above its icon via inset-block-end: 100% (see
    ResetButton.styles.ts's ProgressWrapper) — 3px dots + 0.125rem padding, 5px total.
    Without this, overflow-y: hidden above clips them outright, since they render past this row's
    own block-start edge. The matching negative margin cancels the added padding back out so this
    row still occupies the exact same space in SandboxToolbarRow's layout either way.
  */
  padding: 0.25rem;
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
