import { css } from "@linaria/core";

// Overrides base figures' in-flow margins because a cover leads the page rather than sitting between paragraphs.
export const coverFigureClass = css`
  margin-block: 0 2rem;
`;

// Block-level so the link's hit area and focus ring match the image rather than an inline line box.
export const coverLinkClass = css`
  display: block;
  border-radius: 0.375rem;
`;

// Fills the prose column at the file's own aspect ratio, so the reserved box never shifts on load.
export const coverImageClass = css`
  display: block;
  inline-size: 100%;
  block-size: auto;
  border-radius: 0.375rem;
`;
