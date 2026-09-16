import { styled } from "@linaria/react";

// Stack of one row per track, plus the "Add track" callout button beneath.
export const TrackRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

// One track's own row — a dashed-bottom divider between rows reads as graph-paper ruling rather than a hard solid line.
export const TrackRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding-block-end: 0.375rem;
  border-block-end: 0.0625rem dashed var(--color-border-muted);

  &:last-child {
    border-block-end: none;
    padding-block-end: 0;
  }
`;

// A track's own numeric size field, styled like a dimension callout figure — monospace, right-aligned, the same voice PreviewPane's dimension-line labels use.
export const TrackSizeInput = styled.input`
  inline-size: 3.75rem;
  padding: 0.3125rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  text-align: right;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.1875rem;

  &:disabled {
    opacity: 0.5;
  }

  &:focus {
    outline: none;
    border-color: var(--color-bg-accent-emphasis);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-bg-accent-emphasis) 30%, transparent);
  }
`;

// Removes one track from the list — a plain icon button rather than a filled danger button, matching the low-emphasis remove affordance used across the other goodies' own layer/item lists.
export const TrackRemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.1875rem;
  background: var(--color-bg-default);
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, border-color 150ms ease;

  &:hover {
    color: var(--color-fg-danger);
    border-color: currentColor;
  }
`;

// Adds a fresh track — styled like a drafting-sheet "insert" callout: a dashed-border tab rather than a solid button.
export const AddTrackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  padding: 0.375rem 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-accent);
  background: transparent;
  border: 0.0625rem dashed var(--color-fg-accent);
  border-radius: 0.1875rem;
  cursor: pointer;
  transition: background 150ms ease;

  &:hover {
    background: color-mix(in srgb, var(--color-fg-accent) 10%, transparent);
  }
`;
