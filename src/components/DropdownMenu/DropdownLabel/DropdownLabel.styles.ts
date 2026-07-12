import { css } from "@linaria/core";

// Non-interactive group label — className applied to Radix.Label in the component.
export const labelClass = css`
  padding-block: var(--space-xs);
  padding-inline: var(--space-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semi-bold);
  color: var(--color-fg-muted);
  pointer-events: none;
`;
