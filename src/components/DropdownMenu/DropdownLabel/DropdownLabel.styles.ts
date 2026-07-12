import { css } from "@linaria/core";

// A class rather than a styled component because Radix.Label owns the rendered element.
export const labelClass = css`
  padding-block: 0.25rem;
  padding-inline: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  pointer-events: none;
`;
