import { styled } from "@linaria/react";

// Outer section — provides vertical breathing room above and below the entry list.
export const ChangelogSection = styled.section`
  margin-block: var(--fluid-space-lg);
`;

/*
  Styled as a small-caps eyebrow label rather than a semantic heading — uppercase +
  letter-spacing give it the same visual weight as other section labels on the page.
*/
export const ChangelogTitle = styled.h2`
  font-size: var(--font-size-base);
  margin-block-end: var(--space-base);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 2px;
`;

// Full list-style reset so entries render as plain lines, not bullets.
export const ChangelogEntries = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

/*
  Individual revision entry — date uses default (non-muted) colour so it reads
  as the primary identifier, while the surrounding description text stays muted.
  tabular-nums keeps date columns aligned when multiple entries stack.
*/
export const ChangelogEntryItem = styled.li`
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);
  padding-block: var(--space-xxs);

  time {
    color: var(--color-fg-default);
    font-variant-numeric: tabular-nums;
  }
`;
