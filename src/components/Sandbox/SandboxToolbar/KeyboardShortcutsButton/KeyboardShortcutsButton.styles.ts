import { styled } from "@linaria/react";

/*
  Lays out one card per shortcut category, so a long category never stretches short ones to
  match its height.
*/
export const Grid = styled.div`
  columns: 20rem;
  column-gap: var(--space-xl);
`;

// Single shortcut category — a title stacked above its list of rows.
export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xxs);
  break-inside: avoid;
  margin-block-end: var(--space-lg);
`;

export const GroupTitle = styled.h3`
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semi-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-fg-accent);
  margin-block: var(--space-none) var(--space-xxs);
  margin-inline: var(--space-none);
`;

export const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-xs) var(--space-sm);
  padding-block: var(--space-xxs);

  & + & {
    border-block-start: var(--border-width-default) solid var(--color-border-muted);
  }
`;

// Plain-language explanation of what a shortcut does.
export const Description = styled.span`
  font-size: var(--font-size-sm);
  color: var(--color-fg-default);
`;

/*
  Chip group for one shortcut's key combo(s) — wraps onto its own line on narrow cards rather
  than forcing the row to overflow.
*/
export const Keys = styled.span`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.2em;
  font-size: var(--font-size-xs);
`;

// "/" between platform-variant chips (e.g. Ctrl+F / ⌘+F) — decorative, hidden from AT.
export const KeySeparator = styled.span`
  color: var(--color-fg-muted);
  padding-inline: 0.1em;
`;

// Trailing hint for a secondary combo not worth its own chip (e.g. "or Ctrl+Y").
export const Note = styled.span`
  font-size: var(--font-size-xs);
  color: var(--color-fg-muted);
  margin-inline-start: var(--space-xxs);
`;
