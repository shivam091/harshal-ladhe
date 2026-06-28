import { styled } from "@linaria/react";

// Separates the changelog from the body and meta around it.
export const ChangelogSection = styled.section`
  margin-block: clamp(1.5rem, 2vw, 2rem);
`;

// Eyebrow styling rather than heading size so it carries the same weight as other section labels.
export const ChangelogTitle = styled.h2`
  font-size: 1rem;
  margin-block-end: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

// Full list-style reset so entries render as plain lines, not bullets.
export const ChangelogEntries = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

// Full-colour date reads as each entry's key against muted text; tabular-nums keeps stacked dates aligned.
export const ChangelogEntryItem = styled.li`
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  padding-block: 0.1875rem;

  time {
    color: var(--color-fg-default);
    font-variant-numeric: tabular-nums;
  }
`;
