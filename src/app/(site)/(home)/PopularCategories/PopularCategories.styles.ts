import { styled } from "@linaria/react";

/*
  Vertical list of categories — one row per category, name on the left and
  post count on the right joined by a dotted leader.
*/
export const PopularCategoriesList = styled.ul`
  list-style: none;
  padding: var(--space-none);
  margin-block: var(--space-none);
  display: flex;
  flex-direction: column;
  gap: var(--space-base);
`;

// A single category row: name link, dotted separator, and its post count.
export const PopularCategoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-sm);
  margin-block-end: var(--space-none);

  .category-link {
    color: var(--color-fg-muted);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition-property: color;
    transition-duration: var(--motion-duration-fast);
    transition-timing-function: var(--motion-easing-in-out);
  }

  &:hover .category-link {
    color: var(--color-fg-accent);
  }

  .posts-count {
    font-size: 0.95em;
    color: var(--color-fg-muted);
    white-space: nowrap;
  }
`;

// Dotted leader that fills the space between the name and the count.
export const DottedSeparator = styled.span`
  flex: 1;
  align-self: center;
  border-block-end: var(--border-width-default) dotted var(--color-border-muted);
`;
