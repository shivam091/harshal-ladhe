import { styled } from "@linaria/react";
import { deckledEdge, DESK_FONT, FIGURE_FONT } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";

// Lifts the sheet off the desk — the shadow lives on a wrapper because the sheet's own clip-path would clip a box-shadow away.
export const PaperShadow = styled.div`
  filter: drop-shadow(0 0.375rem 0.5rem color-mix(in srgb, black 30%, transparent));
`;

/*
  A sheet of cream laid paper: faint chain lines running down every couple of centimetres, fine
  laid lines across, a soft vignette at the edges, and a deckled clip-path so the edge looks torn
  rather than guillotined. It's also the nib's positioning context.
*/
export const Paper = styled.div`
  position: relative;
  padding: clamp(1rem, 4vw, 2.25rem);
  color: var(--ld-ink);
  background:
    radial-gradient(ellipse at center, transparent 55%, color-mix(in srgb, var(--color-fg-attention) 14%, transparent)),
    repeating-linear-gradient(90deg, transparent 0 2.4rem, color-mix(in srgb, var(--ld-ink) 6%, transparent) 2.4rem calc(2.4rem + 1px)),
    repeating-linear-gradient(0deg, transparent 0 3px, color-mix(in srgb, var(--ld-ink) 3%, transparent) 3px 4px),
    var(--ld-paper);
  clip-path: ${deckledEdge()};
`;

// Holds the rendered artwork at a steady height so swapping drawings doesn't make the desk jump.
export const ArtworkFrame = styled.div`
  block-size: clamp(14rem, 42vw, 24rem);

  & > svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
  }
`;

// Shown on the paper in place of the artwork when the markup can't be drawn.
export const PaperNote = styled.p`
  display: grid;
  place-items: center;
  block-size: 100%;
  margin: 0;
  font-family: ${DESK_FONT};
  font-style: italic;
  text-align: center;
  color: color-mix(in srgb, var(--ld-ink) 70%, transparent);
`;

/*
  The fountain-pen nib that rides the tip of whichever stroke is being drawn. Positioned by
  transform from the playback loop; its own box is offset so the nib's point, not its corner,
  sits on the line.
*/
export const Nib = styled.span`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  margin-block-start: -1.625rem;
  margin-inline-start: -0.125rem;
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
  filter: drop-shadow(0.125rem 0.1875rem 0.125rem color-mix(in srgb, black 30%, transparent));

  & svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The brass playback fittings under the sheet: play, replay, the scrub rail and the clock.
export const PlaybackRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
`;

/*
  The scrub rail as a brass rod with a round brass knob — native range input underneath, so it
  keeps full keyboard and screen-reader support.
*/
export const ScrubInput = styled.input`
  flex: 1 1 12rem;
  min-inline-size: 8rem;
  block-size: 1.5rem;
  margin: 0;
  background: transparent;
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-runnable-track {
    block-size: 0.375rem;
    border-radius: 999px;
    background: linear-gradient(to bottom, var(--ld-brass-light), var(--ld-brass-dark));
  }

  &::-moz-range-track {
    block-size: 0.375rem;
    border-radius: 999px;
    background: linear-gradient(to bottom, var(--ld-brass-light), var(--ld-brass-dark));
  }

  &::-webkit-slider-thumb {
    inline-size: 1.125rem;
    block-size: 1.125rem;
    margin-block-start: -0.375rem;
    border-radius: 50%;
    border: 0.0625rem solid var(--ld-brass-dark);
    background: radial-gradient(circle at 35% 35%, var(--ld-brass-light), var(--ld-brass) 60%, var(--ld-brass-dark));
    appearance: none;
  }

  &::-moz-range-thumb {
    inline-size: 1.125rem;
    block-size: 1.125rem;
    border-radius: 50%;
    border: 0.0625rem solid var(--ld-brass-dark);
    background: radial-gradient(circle at 35% 35%, var(--ld-brass-light), var(--ld-brass) 60%, var(--ld-brass-dark));
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.25rem;
    border-radius: 0.25rem;
  }
`;

// The elapsed / total clock, in tabular figures so it doesn't jitter while playing.
export const TimeReadout = styled.output`
  min-inline-size: 7.5rem;
  font-family: ${FIGURE_FONT};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  text-align: end;
  color: var(--color-fg-muted);
`;
