import { css } from "@linaria/core";

// Capped at the column so authored dimensions wider than the prose can't force horizontal scroll.
export const imageClass = css`
  display: block;
  max-inline-size: 100%;
  block-size: auto;
  margin-inline: auto;
  border-radius: 0.375rem;
`;
