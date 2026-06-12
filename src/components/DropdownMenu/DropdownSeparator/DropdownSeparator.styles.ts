import { css } from "@linaria/core";

// A class rather than a styled component because Radix.Separator owns the rendered element.
export const separatorClass = css`
  block-size: 1px;
  background: var(--color-border-muted);
  margin-block: 0.25rem;
`;
