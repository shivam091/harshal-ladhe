import { styled } from "@linaria/react";

// Compact list of the most recently-updated posts, tutorials, and snippets — one title link per row.
export const RecentlyUpdatedEntriesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-block: 0;
  color: var(--color-fg-muted);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// A single row — arrow glyph plus the entry title link.
export const RecentlyUpdatedEntryItem = styled.li`
  margin-block-end: 0;

  .recently-updated-entry {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--color-fg-muted);
    text-decoration: none;
    transition-property: color;
    transition-duration: 150ms;
    transition-timing-function: cubic-bezier(0.6, 0, 0.2, 1);
  }

  .recently-updated-entry svg {
    flex-shrink: 0;
  }

  &:hover .recently-updated-entry {
    color: var(--color-fg-accent);
  }
`;
