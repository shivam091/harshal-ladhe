import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// The playback strip under the baseboard, cased like the controller so play and scrub feel like part of it.
export const PlaybackStrip = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  color: var(--rail-case-text);
  background: linear-gradient(to bottom, color-mix(in oklab, white 8%, var(--rail-case)), var(--rail-case));
  border-radius: 0.5rem;
`;

// The scrub track takes whatever width is left beside the buttons.
export const ScrubLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1 1 10rem;
  min-inline-size: 0;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

// A native range restyled as a short length of rail: steel track, brass thumb.
export const ScrubInput = styled.input`
  flex: 1 1 auto;
  min-inline-size: 0;
  block-size: 0.375rem;
  appearance: none;
  background: repeating-linear-gradient(90deg, var(--rail-sleeper) 0 0.1875rem, var(--rail-steel) 0.1875rem 0.5rem);
  border-radius: 0.1875rem;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    inline-size: 1rem;
    block-size: 1rem;
    border-radius: 0.25rem;
    background: var(--rail-brass);
    border: 0.125rem solid color-mix(in oklab, var(--rail-brass) 40%, black);
  }

  &::-moz-range-thumb {
    inline-size: 1rem;
    block-size: 1rem;
    border-radius: 0.25rem;
    background: var(--rail-brass);
    border: 0.125rem solid color-mix(in oklab, var(--rail-brass) 40%, black);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.25rem;
  }
`;

// Elapsed seconds, in a fixed-width face so the strip doesn't jitter while it counts.
export const TimeReadout = styled.output`
  min-inline-size: 4.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  text-align: end;
`;
