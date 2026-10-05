import { styled } from "@linaria/react";

/*
  One siding on the track diagram. --tone carries the queue's colour (set from data-tone) so the
  rails, the route lamp, and every car on this siding all agree without each repeating the mapping.
*/
export const SidingRow = styled.div`
  --tone: var(--color-fg-accent);

  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  align-items: center;
  gap: 0.625rem;

  &[data-tone="stack"] {
    --tone: var(--color-fg-attention);
  }
  &[data-tone="micro"] {
    --tone: var(--color-fg-success);
  }
  &[data-tone="macro"] {
    --tone: var(--color-fg-accent);
  }
  &[data-tone="raf"] {
    --tone: var(--color-fg-danger);
  }

  @media (max-width: 30rem) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

// The siding's name plate, with its route lamp leading.
export const SidingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--signal-mono);
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-fg-default);
`;

// The route lamp — dark until the loop is routing work from this siding, then lit and glowing in the siding's own colour.
export const RouteLamp = styled.span`
  flex: 0 0 auto;
  inline-size: 0.625rem;
  block-size: 0.625rem;
  border-radius: 50%;
  background: var(--signal-lamp-off);
  border: 0.0625rem solid color-mix(in oklab, black 25%, transparent);
  transition: background 200ms ease, box-shadow 200ms ease;

  &[data-lit="true"] {
    background: var(--tone);
    box-shadow: 0 0 0.625rem 0.125rem color-mix(in oklab, var(--tone) 65%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

/*
  The track itself: two rails drawn as gradient lines over a row of sleepers. Cars sit on it in
  queue order with the front of the queue nearest the turntable end (inline-end), so "next to run"
  is always the car closest to the exit.
*/
export const Track = styled.ol`
  position: relative;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  align-items: center;
  gap: 0.375rem;
  min-block-size: 2.5rem;
  margin: 0;
  padding: 0.25rem 0.5rem;
  list-style: none;
  overflow-x: auto;
  scrollbar-width: thin;
  background:
    linear-gradient(to bottom, transparent calc(50% + 0.5rem), var(--signal-rail) calc(50% + 0.5rem), var(--signal-rail) calc(50% + 0.625rem), transparent calc(50% + 0.625rem)),
    linear-gradient(to bottom, transparent calc(50% - 0.625rem), var(--signal-rail) calc(50% - 0.625rem), var(--signal-rail) calc(50% - 0.5rem), transparent calc(50% - 0.5rem)),
    repeating-linear-gradient(to right, transparent 0, transparent 0.625rem, color-mix(in oklab, var(--color-fg-muted) 22%, transparent) 0.625rem, color-mix(in oklab, var(--color-fg-muted) 22%, transparent) 0.875rem);
  border-radius: 0.25rem;

  &[data-orientation="vertical"] {
    flex-direction: column-reverse;
    align-items: stretch;
    min-block-size: 3rem;
    background:
      linear-gradient(to right, transparent 0.5rem, var(--signal-rail) 0.5rem, var(--signal-rail) 0.625rem, transparent 0.625rem),
      linear-gradient(to left, transparent 0.5rem, var(--signal-rail) 0.5rem, var(--signal-rail) 0.625rem, transparent 0.625rem);
  }
`;

/*
  A rail car — a rounded wagon body with two wheels drawn by a single radial-gradient pseudo
  element. New cars roll in from the far end of the siding; the slide is switched off under
  prefers-reduced-motion so the queue simply updates in place.
*/
export const Car = styled.li`
  position: relative;
  flex: 0 0 auto;
  max-inline-size: 13rem;
  padding: 0.25rem 0.5rem 0.375rem;
  font-family: var(--signal-mono);
  font-size: 0.6875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-fg-default);
  background: color-mix(in oklab, var(--tone) 22%, var(--signal-enamel-deep));
  border: 0.0625rem solid color-mix(in oklab, var(--tone) 70%, transparent);
  border-radius: 0.3125rem;
  animation: event-loop-car-in 320ms cubic-bezier(0.16, 1, 0.3, 1);

  &::after {
    content: "";
    position: absolute;
    inset-inline: 0.375rem;
    inset-block-end: -0.1875rem;
    block-size: 0.375rem;
    background:
      radial-gradient(circle at 0.1875rem 50%, var(--color-fg-muted) 0.125rem, transparent 0.15rem),
      radial-gradient(circle at calc(100% - 0.1875rem) 50%, var(--color-fg-muted) 0.125rem, transparent 0.15rem);
  }

  [data-orientation="vertical"] > & {
    max-inline-size: none;
    animation-name: event-loop-car-drop;
  }

  &[data-top="true"] {
    box-shadow: 0 0 0.75rem 0 color-mix(in oklab, var(--tone) 50%, transparent);
  }

  @keyframes event-loop-car-in {
    from {
      transform: translateX(-2rem);
      opacity: 0;
    }
  }

  @keyframes event-loop-car-drop {
    from {
      transform: translateY(-0.75rem);
      opacity: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Shown on an empty siding so "nothing waiting" is stated in words, not just implied by bare rails.
export const EmptyTrack = styled.li`
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-fg-muted);
  background: var(--signal-enamel-deep);
  padding-inline: 0.25rem;
`;
