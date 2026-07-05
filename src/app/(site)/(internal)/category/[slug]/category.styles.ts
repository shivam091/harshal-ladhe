import { styled } from "@linaria/react";

// Per-category archive wrapper — the intro line sits above the reused post feed.
export const CategoryArchiveSection = styled.section``;

// Matches the standard page title so category pages read like every other top-level heading.
export const CategoryArchiveTitle = styled.h1`
  letter-spacing: 0.5px;
  margin-block-end: 2rem;
  color: var(--color-fg-heading);
`;

export const CategoryDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.625;
  margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
`;
