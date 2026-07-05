import { styled } from "@linaria/react";

// Dotted leaders line names up with their counts for quick comparison.
export const PopularCategoriesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-block: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// A single category row: name link, dotted separator, and its entry count.
export const PopularCategoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.5rem;
  margin-block-end: 0;

  .category-link {
    color: var(--color-fg-muted);
    text-decoration: none;
    font-weight: 500;
    transition-property: color;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.6, 0, 0.2, 1);
  }

  &:hover .category-link {
    color: var(--color-fg-accent);
  }

  .entries-count {
    font-size: 0.95em;
    color: var(--color-fg-muted);
    white-space: nowrap;
  }
`;

// Dotted leader that fills the space between the name and the count.
export const DottedSeparator = styled.span`
  flex: 1;
  align-self: center;
  border-block-end: 0.0625rem dotted var(--color-border-muted);
`;
