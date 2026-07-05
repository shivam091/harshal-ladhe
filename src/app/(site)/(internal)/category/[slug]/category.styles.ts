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
  margin-block-end: var(--space-xl);
  color: var(--color-fg-heading);
`;

// Kicker above the title — the raw category name plus its post count, muted.
export const CategoryArchiveKicker = styled.p`
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);
  font-weight: var(--font-weight-medium);
  margin-block: var(--space-lg);

  .category-count {
    color: var(--color-fg-neutral);
  }
`;

export const CategoryDescription = styled.p`
  font-size: var(--fluid-font-size-md);
  line-height: var(--line-height-relaxed);
  margin-block-end: var(--fluid-space-base);
`;
