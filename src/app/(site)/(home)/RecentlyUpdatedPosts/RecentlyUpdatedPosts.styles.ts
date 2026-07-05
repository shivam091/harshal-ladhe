import { styled } from "@linaria/react";

// Compact list of the most recently-updated posts — one title link per row.
export const RecentlyUpdatedPostsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-block: 0;
  color: var(--color-fg-muted);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// A single row — arrow glyph plus the post title link.
export const RecentlyUpdatedPostItem = styled.li`
  margin-block-end: 0;

  .recently-updated-post {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-fg-muted);
    text-decoration: none;
    transition-property: color;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.6, 0, 0.2, 1);
  }

  .recently-updated-post svg {
    flex-shrink: 0;
  }

  &:hover .recently-updated-post {
    color: var(--color-fg-accent);
  }
`;
