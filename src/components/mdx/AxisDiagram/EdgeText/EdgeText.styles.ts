import { css } from "@linaria/core";

// Bold monospace styling for an edge's logical term (e.g. "inline-start").
export const termTextClass = css`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 13px;
`;

// Smaller muted monospace styling for an edge's physical-side hint (e.g. "(left)").
export const physicalTextClass = css`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 10px;
  fill: var(--color-fg-muted);
`;
