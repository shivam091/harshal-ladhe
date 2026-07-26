import { styled } from "@linaria/react";

/*
  Lays out one card per shortcut category, so a long category never stretches short ones to
  match its height.
*/
export const Grid = styled.div`
  columns: 20rem;
  column-gap: 2rem;
`;

// Single shortcut category — a title stacked above its list of rows.
export const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1875rem;
  break-inside: avoid;
  margin-block-end: 1.5rem;
`;

export const GroupTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-fg-accent);
  margin-block: 0 0.1875rem;
  margin-inline: 0;
`;

export const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
  padding-block: 0.1875rem;

  & + & {
    border-block-start: 0.0625rem solid var(--color-border-muted);
  }
`;

// Plain-language explanation of what a shortcut does.
export const Description = styled.span`
  font-size: 0.875rem;
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
  font-size: 0.75rem;
`;

// "/" between platform-variant chips (e.g. Ctrl+F / ⌘+F) — decorative, hidden from AT.
export const KeySeparator = styled.span`
  color: var(--color-fg-muted);
  padding-inline: 0.1em;
`;

// Trailing hint for a secondary combo not worth its own chip (e.g. "or Ctrl+Y").
export const Note = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  margin-inline-start: 0.1875rem;
`;
