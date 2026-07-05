import { styled } from "@linaria/react";

// Per-category archive wrapper — the intro line sits above the reused post feed.
export const CategoryArchiveSection = styled.section``;

/*
  Archive <h1> — the descriptive category title from the registry. Mirrors
  PageHeading's PageTitle so the category pages read the same as every other
  top-level heading.
*/
export const CategoryArchiveTitle = styled.h1`
  letter-spacing: 0.5px;
  margin-block-end: 2rem;
  color: var(--color-fg-heading);
`;

// Kicker above the title — the raw category name plus its post count, muted.
export const CategoryArchiveKicker = styled.p`
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  font-weight: 500;
  margin-block: 1.5rem;

  .category-count {
    color: var(--color-fg-neutral);
  }
`;

export const CategoryDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.625;
  margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
`;
