import { css } from "@linaria/core";

// Non-interactive group label — className applied to Radix.Label in the component.
export const labelClass = css`
  padding-block: 0.25rem;
  padding-inline: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  pointer-events: none;
`;
