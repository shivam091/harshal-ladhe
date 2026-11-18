import { styled } from "@linaria/react";

// Scrollable stack of match cards.
export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-block-size: 24rem;
  overflow-y: auto;
  overflow-x: visible;
  scrollbar-width: thin;
`;

// One match's own index card — a dashed rule down the side in this match's tape color, tying it back to the same match's highlighter stroke in MatchHighlight.
export const MatchCard = styled.li`
  position: relative;
  padding: 0.625rem 0.75rem 0.625rem 0.875rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-inline-start: 0.1875rem dashed color-mix(in srgb, var(--match-color, var(--color-fg-attention)) 65%, transparent);
  border-radius: 0.375rem;
`;

// The match's own position and literal text, e.g. `#1 at index 13: "2024-01-15"`.
export const MatchHeader = styled.p`
  margin: 0 0 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

// Muted "#N at index M:" prefix within MatchHeader.
export const MatchIndex = styled.span`
  color: var(--color-fg-muted);
`;

// Row the sticky notes sit in — generous block padding since each note tilts a few degrees and shouldn't clip its neighbors.
export const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem 0.75rem;
  padding-block: 0.25rem;
`;

/*
  Flagship flourish #2 — one capture group as a small rotated sticky-note tag with a folded top-right
  corner (a clipped triangle plus a matching diagonal shadow), colored from the same tape palette as
  its parent match's highlighter stroke. `--note-tilt` is set per-instance so neighboring notes don't
  all lean the same way, like marginalia jotted down at slightly different times.
*/
export const StickyNote = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-inline-size: 5.25rem;
  max-inline-size: 11rem;
  padding: 0.375rem 0.5625rem 0.5rem;
  background: color-mix(in srgb, var(--note-color, var(--color-fg-attention)) 24%, var(--color-bg-default));
  border: 0.0625rem solid color-mix(in srgb, var(--note-color, var(--color-fg-attention)) 48%, transparent);
  border-radius: 0.125rem;
  box-shadow: var(--box-shadow-sm);
  transform: rotate(var(--note-tilt, -1.5deg));
  clip-path: polygon(0 0, calc(100% - 0.5rem) 0, 100% 0.5rem, 100% 100%, 0 100%);

  &::after {
    content: "";
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 0;
    inline-size: 0.5rem;
    block-size: 0.5rem;
    background: linear-gradient(135deg, transparent 50%, color-mix(in srgb, var(--note-color, var(--color-fg-attention)) 60%, transparent) 50%);
  }
`;

// A sticky note's small-caps heading — "Group 1", or the group's own name.
export const StickyNoteLabel = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-fg-muted);
`;

// A sticky note's captured text, or "(not captured)" for an optional group that didn't participate.
export const StickyNoteValue = styled.span`
  overflow: hidden;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-default);
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// Shown when the pattern is valid but found nothing in the test string.
export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
