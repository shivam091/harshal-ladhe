import { styled } from "@linaria/react";

// Two columns of notes once there's room — eight short paragraphs in one column would push the batch table a long way down.
export const NoteList = styled.dl`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0.5rem;
  margin: 0;

  @media (min-width: 44rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

// A pattern-paper slip per unit; the active unit's slip gets the tape-yellow edge, matching its converter row.
export const NoteItem = styled.div`
  padding: 0.5rem 0.625rem;
  border: 0.0625rem dashed var(--color-border-muted);
  border-radius: 0.25rem;
  background: var(--color-bg-default);

  &[data-active="true"] {
    border-style: solid;
    border-color: color-mix(in srgb, var(--color-fg-attention) 60%, var(--color-border-default));
    background: color-mix(in srgb, var(--color-fg-attention) 7%, var(--color-bg-default));
  }
`;

// Unit and what it resolves against on one line, so the slip's first glance answers "relative to what?".
export const NoteTerm = styled.dt`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-default);

  & code {
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  }
`;

// Secondary to the unit name — lighter weight so the two don't compete.
export const NoteResolves = styled.span`
  font-weight: 500;
  color: var(--color-fg-muted);
`;

// The gotcha itself — kept small since it's reference copy, not the tool's main readout.
export const NoteBody = styled.dd`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  line-height: 1.55;
  color: var(--color-fg-muted);
`;
