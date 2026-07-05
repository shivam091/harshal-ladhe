import { styled } from "@linaria/react";

// Compact list of the most recently-updated posts — one title link per row.
export const RecentlyUpdatedPostsList = styled.ul`
  list-style: none;
  padding: var(--space-none);
  margin-block: var(--space-none);
  color: var(--color-fg-muted);
  display: flex;
  flex-direction: column;
  gap: var(--space-base);
`;

// A single row — arrow glyph plus the post title link.
export const RecentlyUpdatedPostItem = styled.li`
  margin-block-end: var(--space-none);

  .recently-updated-post {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    color: var(--color-fg-muted);
    text-decoration: none;
    transition-property: color;
    transition-duration: var(--motion-duration-fast);
    transition-timing-function: var(--motion-easing-ease-in-out);
  }

  .recently-updated-post svg {
    flex-shrink: 0;
  }

  &:hover .recently-updated-post {
    color: var(--color-fg-accent);
  }
`;
