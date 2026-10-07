import { styled } from "@linaria/react";
import { MONO_FONT, SERIF_FONT } from "@/components/SvgPathMorph/SvgPathMorph.styles";

// Positions the hub knob over the dial's centre.
export const AstrolabeFrame = styled.div`
  position: relative;
  inline-size: min(100%, 13rem);
  aspect-ratio: 1;
`;

// The dial is the slider itself — a round focus ring traces the brass rim instead of a square box.
export const Dial = styled.div`
  inline-size: 100%;
  block-size: 100%;
  border-radius: 50%;
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.25rem;
  }

  &[aria-disabled="true"] {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

/*
  The astrolabe face: a brass mater, an engraved limb of ticks, a faint rete of overlapping rings,
  keyframe letters round the rim (the current leg's two lit), and the alidade as the playhead.
*/
export const DialSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: 100%;
  overflow: visible;

  & .mater {
    fill: var(--bench-brass);
    stroke: var(--bench-brass-deep);
    stroke-width: 3;
  }

  & .limb {
    fill: color-mix(in oklab, var(--bench-brass) 55%, var(--bench-parchment));
    stroke: var(--bench-brass-deep);
    stroke-width: 1;
  }

  & .track {
    fill: none;
    stroke: color-mix(in oklab, var(--bench-brass-deep) 35%, transparent);
    stroke-width: 4;
    stroke-linecap: round;
  }

  & .filled {
    fill: none;
    stroke: var(--bench-wax);
    stroke-width: 4;
    stroke-linecap: round;
  }

  & .tick {
    stroke: var(--bench-brass-deep);
    stroke-width: 1;
  }

  & .tick.major {
    stroke-width: 1.75;
  }

  & .rete {
    fill: none;
    stroke: color-mix(in oklab, var(--bench-brass-deep) 45%, transparent);
    stroke-width: 1;
  }

  & .keyframe-mark circle {
    fill: var(--bench-brass-deep);
  }

  & .keyframe-mark text {
    font-family: ${SERIF_FONT};
    font-size: 14px;
    font-weight: 800;
    fill: color-mix(in oklab, var(--bench-brass-deep) 70%, black);
    opacity: 0.55;
  }

  & .keyframe-mark[data-active="true"] text {
    opacity: 1;
  }

  & .keyframe-mark[data-active="true"] circle {
    fill: var(--bench-wax);
  }

  & .alidade line {
    stroke: color-mix(in oklab, var(--bench-brass-deep) 80%, black);
    stroke-width: 4;
    stroke-linecap: round;
  }

  & .alidade circle {
    fill: var(--bench-wax);
    stroke: var(--bench-brass-light);
    stroke-width: 1.5;
  }
`;

// The play/pause knob at the hub — a domed brass pin, centred over the dial.
export const HubButton = styled.button`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  display: grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  padding: 0;
  color: color-mix(in oklab, var(--bench-brass-deep) 75%, black);
  background: radial-gradient(circle at 35% 30%, var(--bench-brass-light), var(--bench-brass) 55%, var(--bench-brass-deep));
  border: 0.125rem solid var(--bench-brass-deep);
  border-radius: 50%;
  box-shadow:
    inset 0 0.0625rem 0 color-mix(in oklab, white 45%, transparent),
    0 0.1875rem 0.375rem color-mix(in oklab, black 40%, transparent);
  transform: translate(-50%, -50%);
  cursor: pointer;

  &:active:not(:disabled) {
    transform: translate(-50%, -50%) scale(0.96);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// The engraved readout under the dial: percentage and which two keyframes the playhead is between.
export const Readout = styled.p`
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: color-mix(in oklab, var(--bench-ink) 75%, var(--color-fg-muted));
`;
