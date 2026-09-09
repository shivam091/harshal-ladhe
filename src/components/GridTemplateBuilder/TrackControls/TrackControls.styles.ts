import { styled } from "@linaria/react";

// Stack of TrackRow cards — one per column or row track.
export const TrackRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// One track's own card — the plain size+unit+remove row, plus (only for minmax) the MinMaxRow beneath it.
export const TrackRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0.375rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
`;

// The size input / unit select / remove button every track always shows, regardless of its own unit.
export const TrackMainRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 5rem auto;
  align-items: center;
  gap: 0.375rem;
`;

// Only rendered while a track's own unit is "minmax" — the min/max value+unit pairs that its single main-row size field can't express.
export const MinMaxRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.375rem;
  padding-inline-start: 0.125rem;
`;

// One value+unit pair within MinMaxRow — used twice (min, max) for the same track.
export const MinMaxField = styled.div`
  display: grid;
  grid-template-columns: 1fr 4rem;
  gap: 0.25rem;
`;

// "minmax(min, max)" caption spanning both MinMaxFields, so the pair beneath it reads as one compound value rather than two unrelated fields.
export const MinMaxLabel = styled.span`
  grid-column: 1 / -1;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);
`;

// Numeric input shared by a track's own size field and both of its minmax min/max fields.
export const TrackSizeInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.25rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;

  &:disabled {
    opacity: 0.5;
  }
`;

// Removes one track — disabled once only one track remains, since a track list can't compile to anything meaningful empty.
export const TrackRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// Appends a new track — disabled at MAX_TRACKS, dashed border marks it as an "add" affordance rather than a real track row.
export const AddTrackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem dashed var(--color-border-default);
  border-radius: 0.375rem;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;
