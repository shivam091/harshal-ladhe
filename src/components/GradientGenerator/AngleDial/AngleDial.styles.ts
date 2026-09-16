import { styled } from "@linaria/react";

// Vertical label+control stack for one geometry field — this tool's own copy of the label/field pairing pattern (each geometry control owns its own glass chrome rather than sharing a plain-form field wrapper from an unrelated feature).
export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

// Small-caps label above the dial.
export const FieldLabel = styled.label`
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

/*
  The dial's own drag surface AND the tool's flagship tactile control — a large glass disc rather
  than a compact inline knob, so dragging it feels like turning a physical dial rather than nudging
  a small form control. Square via aspect-ratio so the 0-100% pointer math in AngleDial.tsx (which
  assumes a square container centered on (50, 50)) always maps onto a true circle. Also the
  slider-role keyboard target: the whole face — not just the visual handle — is focusable and
  draggable, so a single click-and-drag anywhere on it jumps to and then follows the pointer.
*/
export const DialFace = styled.div`
  position: relative;
  inline-size: clamp(9rem, 26vw, 11rem);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: color-mix(in srgb, var(--color-bg-default) 60%, transparent);
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 55%, transparent);
  box-shadow: var(--box-shadow-sm), inset 0 0 0 0.0625rem color-mix(in srgb, var(--color-fg-accent) 8%, transparent);
  cursor: grab;
  touch-action: none;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus);
    outline-offset: 0.1875rem;
  }
`;

// Fills DialFace — ticks, track, sweep, needle, and handle all live in this one 0-100 coordinate space matching AngleDial.tsx's own angle/point math. Purely decorative (DialFace itself is the real drag/focus target), so it never intercepts pointer events.
export const DialSvg = styled.svg`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  overflow: visible;
  pointer-events: none;
`;

// One tick mark at a 30deg interval around the dial's rim.
export const DialTick = styled.line`
  stroke: color-mix(in srgb, var(--color-fg-muted) 45%, transparent);
  stroke-width: 1.25;
  stroke-linecap: round;
`;

// The dial's base ring.
export const DialTrack = styled.circle`
  fill: none;
  stroke: color-mix(in srgb, var(--color-border-default) 70%, transparent);
  stroke-width: 2;
`;

// Arc sweeping from 0deg (top) to the current angle — a quick-glance "pie slice" of how far the dial has turned, drawn via stroke-dasharray over DialTrack's own circle geometry rather than a separate filled path.
export const DialSweep = styled.circle`
  fill: none;
  stroke: var(--color-fg-accent);
  stroke-width: 2.5;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  filter: drop-shadow(0 0 0.25rem color-mix(in srgb, var(--color-fg-accent) 65%, transparent));
`;

// Thin spoke from center to the handle.
export const DialNeedle = styled.line`
  stroke: color-mix(in srgb, var(--color-fg-accent) 70%, transparent);
  stroke-width: 1.5;
  stroke-linecap: round;
`;

// The glowing dot marking the current angle on the rim.
export const DialHandle = styled.circle`
  fill: var(--color-fg-accent);
  stroke: var(--color-bg-default);
  stroke-width: 1.5;
  filter: drop-shadow(0 0 0.375rem color-mix(in srgb, var(--color-fg-accent) 80%, transparent));
`;

// Big centered numeric readout riding inside the dial's own hole — the direct-manipulation payoff of dragging: the value updates right where your thumb is. Marked aria-hidden since the dial's own role="slider" already exposes the value via aria-valuenow/aria-valuetext.
export const DialReadout = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

// The angle's number, large and tabular so digit-width changes (9 -> 90 -> 359) don't jiggle the layout.
export const DialValue = styled.span`
  font-variant-numeric: tabular-nums;
  font-size: 1.625rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// "deg" beneath the number, small and muted.
export const DialUnit = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// Row holding the precise numeric entry beneath the dial, for typing an exact angle rather than dragging one.
export const DegreesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

// Exact-angle text field, kept in sync with the dial in both directions.
export const DegreesInput = styled.input`
  inline-size: 4rem;
  padding: 0.375rem 0.5rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-bg-default) 70%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  border-radius: 0.375rem;

  &:focus {
    outline: none;
    border-color: var(--color-fg-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-accent) 22%, transparent);
  }
`;

// "deg" suffix beside DegreesInput.
export const DegreesSuffix = styled.span`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
