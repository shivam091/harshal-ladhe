import { styled } from "@linaria/react";

/*
  Scrolls horizontally because the tape is drawn at true CSS px — shrinking it to fit would defeat
  the "see the real length" point. Forced LTR since a tape measure reads from its zero end
  regardless of the page's writing direction.
*/
export const TapeScroller = styled.div`
  position: relative;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  direction: ltr;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--color-bg-muted) 70%, transparent);

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// Sized by inline style to the tape's own px length; everything inside is positioned against it.
export const TapeTrack = styled.div`
  position: relative;
  padding-block-end: 0.25rem;
`;

// The drag rail along the top — the only part that captures pointers, so the strips below can still be swiped to scroll on touch screens.
export const HandleRail = styled.div`
  position: relative;
  block-size: 2rem;
  touch-action: none;
  cursor: ew-resize;
  background-image: repeating-linear-gradient(
    to right,
    color-mix(in srgb, var(--color-fg-muted) 25%, transparent) 0 0.25rem,
    transparent 0.25rem 0.5rem
  );
  background-size: 100% 0.0625rem;
  background-repeat: no-repeat;
  background-position: 0 100%;
`;

/*
  The brass end-tab of a tape measure, pulled out to the measured length. It is the slider itself
  (role="slider"), so keyboard users drag it with the arrow keys exactly as a pointer drags the rail.
*/
export const TapeHandle = styled.div`
  position: absolute;
  inset-block-start: 0.25rem;
  inset-inline-start: 0;
  display: inline-flex;
  align-items: center;
  block-size: 1.5rem;
  padding-inline: 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  color: var(--color-fg-on-emphasis, var(--color-bg-default));
  background: color-mix(in srgb, var(--color-fg-attention) 75%, var(--color-fg-default));
  border-radius: 0.25rem 0.25rem 0.25rem 0;
  box-shadow: 0 0.0625rem 0.1875rem color-mix(in srgb, var(--color-fg-default) 30%, transparent);
  cursor: grab;
  transition: transform 120ms ease-out;

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  [data-dragging="true"] & {
    cursor: grabbing;
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// One unit's ruler — tape-yellow for px (the real tape), paler cloth-tape for the derived units so the reference strip stands out.
export const Strip = styled.div`
  position: relative;
  block-size: 2.25rem;
  margin-block-start: 0.25rem;
  color: var(--tape-ink);
  background: color-mix(in srgb, var(--tape-colour) 45%, var(--color-bg-default));
  border-block: 0.0625rem solid color-mix(in srgb, var(--color-fg-attention) 35%, transparent);

  &[data-reference="true"] {
    background: var(--tape-colour);
  }

  &[data-source="true"] {
    border-block-color: var(--color-fg-attention);
  }

  & > svg {
    position: absolute;
    inset: 0;
    display: block;
    overflow: visible;
    pointer-events: none;
  }
`;

// Sticks to the scroller's left edge while the tape scrolls beneath, so a strip is never anonymous halfway along a long length.
export const StripLabel = styled.span`
  position: sticky;
  inset-inline-start: 0;
  z-index: 1;
  display: inline-flex;
  align-items: baseline;
  gap: 0.375rem;
  margin-block-start: 1.125rem;
  padding: 0.0625rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-bg-default) 88%, transparent);
  border-start-end-radius: 0.1875rem;
`;

// The strip's current reading beside its unit — muted so the unit name stays the label's anchor.
export const StripReading = styled.span`
  font-weight: 500;
  color: var(--color-fg-muted);
`;

// Chalk shading over every strip up to the measured length — what makes "1.5rem ends here, 10vw ends there" readable at a glance.
export const MeasuredBand = styled.div`
  position: absolute;
  inset-block: 2rem 0;
  inset-inline-start: 0;
  inline-size: 0;
  background-image: repeating-linear-gradient(
    -45deg,
    color-mix(in srgb, var(--color-fg-accent) 16%, transparent) 0 0.125rem,
    transparent 0.125rem 0.375rem
  );
  pointer-events: none;
`;

// The tailor's chalk line straight down through every strip at the measured length.
export const ChalkLine = styled.div`
  position: absolute;
  inset-block: 1.75rem 0;
  inset-inline-start: 0;
  inline-size: 0.125rem;
  margin-inline-start: -0.0625rem;
  background-image: repeating-linear-gradient(to bottom, var(--color-fg-accent) 0 0.375rem, transparent 0.375rem 0.5rem);
  pointer-events: none;
  transition: transform 120ms ease-out;

  [data-dragging="true"] & {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
