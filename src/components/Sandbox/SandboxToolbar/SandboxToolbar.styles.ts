import { css } from "@linaria/core";

/*
  Row of toolbar action buttons in the sandbox header. A plain class (not `styled()`) applied
  via className to Radix's Toolbar.Root — wrapping that component with `styled()` here would
  pull it into linaria's static-eval sandbox, which can't import the Node builtins Radix's
  bundle references. Mirrors Tooltip.styles.ts's contentClass, applied the same way.
*/
export const rootClass = css`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
`;

// Vertical divider between the editor-actions and sandbox-actions button groups.
export const separatorClass = css`
  inline-size: 1px;
  block-size: 1.25rem;
  margin-inline: 0.125rem;
  background: var(--color-border-muted);
`;
