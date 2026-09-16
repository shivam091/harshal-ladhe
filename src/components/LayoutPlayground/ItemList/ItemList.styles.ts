import { styled } from "@linaria/react";

// The parts schedule's own rows, stacked with a hairline rule between them — reads as a table's own row dividers.
export const Schedule = styled.div`
  display: flex;
  flex-direction: column;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  overflow: hidden;
`;

// One row of the schedule — a part's own selectable entry plus its actions.
export const PartRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  background: var(--color-bg-default);

  &:not(:last-child) {
    border-block-end: 0.0625rem solid var(--color-border-muted);
  }

  &[data-selected="true"] {
    background: color-mix(in srgb, var(--color-fg-accent) 8%, var(--color-bg-default));
  }
`;

// The clickable part of a row — selecting it is how ItemControls knows which item's fields to show.
export const PartButton = styled.button`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.5rem;
  min-inline-size: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: inherit;
  text-align: start;
  cursor: pointer;
`;

// The part's own catalog number — "#01" read as a drawing's own bill-of-materials index, monospace and muted so PartLabel (the item's actual color swatch) stays the visual focus.
export const PartNumber = styled.span`
  flex: 0 0 auto;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-fg-muted);
`;

/*
  Tiny drafted-rectangle icon standing in for the part's own drawn shape — a translucent hatch fill
  (repeating diagonal lines, like a technical drawing's material cross-hatching) over the item's own
  color, plus a thin matching-color border. Its own inline-size is left to the caller (PartIcon's
  own aspect-ratio + a fixed block-size), so the same treatment can read as a wide flex box or a
  tall spanning grid cell depending on the item it represents.
*/
export const PartIcon = styled.span`
  flex: 0 0 auto;
  display: block;
  block-size: 1.25rem;
  border-radius: 0.125rem;
  border: 0.0625rem solid color-mix(in srgb, currentColor 55%, transparent);
  background-image: repeating-linear-gradient(
    135deg,
    color-mix(in srgb, currentColor 45%, transparent) 0,
    color-mix(in srgb, currentColor 45%, transparent) 0.0625rem,
    transparent 0.0625rem,
    transparent 0.25rem
  );
  background-color: color-mix(in srgb, currentColor 12%, transparent);
`;

// The item's own human label, e.g. "Item 3" — truncates rather than wrapping so a long custom label can't blow out the row's height.
export const PartLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
`;

// Duplicate/remove actions pinned to the row's end.
export const PartActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  flex: 0 0 auto;
`;

// One small action button (duplicate or remove) within a row.
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.625rem;
  block-size: 1.625rem;
  padding: 0;
  border: none;
  border-radius: 0.1875rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease;

  &:hover {
    color: var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 12%, transparent);
  }
`;

// Adds a fresh part to the schedule — a dashed-border tab, matching GridContainerControls' own AddTrackButton voice.
export const AddPartButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  align-self: flex-start;
  margin-block-start: 0.625rem;
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

// Shown in place of the schedule when there are no parts yet.
export const EmptyState = styled.p`
  margin: 0;
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
  text-align: center;
  border: 0.0625rem dashed var(--color-border-muted);
  border-radius: 0.25rem;
`;
