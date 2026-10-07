import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// Label, knob and readout stacked and centred, like the big dial on a model railway controller.
export const DialWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
`;

// The dial's printed legend above the knob.
export const DialLabel = styled.span`
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

// The focusable knob itself — a slider in ARIA terms, turned by dragging round it or with the arrow keys.
export const DialFace = styled.div`
  inline-size: 8.5rem;
  block-size: 8.5rem;
  border-radius: 50%;
  touch-action: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 0.1875rem solid var(--color-fg-accent);
    outline-offset: 0.1875rem;
  }

  & svg {
    display: block;
    inline-size: 100%;
    block-size: 100%;
    overflow: visible;
  }
`;

// The scale printed round the knob — brass ticks on the dark case.
export const DialTick = styled.line`
  stroke: var(--rail-brass);
  stroke-width: 2;
  stroke-linecap: round;
`;

// The live part of the scale, lit up to the current setting so the value reads at a glance.
export const DialArc = styled.path`
  fill: none;
  stroke: var(--rail-brass);
  stroke-width: 4;
  stroke-linecap: round;
  opacity: 0.85;
`;

// The unlit remainder of the scale.
export const DialArcTrack = styled.path`
  fill: none;
  stroke: color-mix(in oklab, var(--rail-case-text) 18%, transparent);
  stroke-width: 4;
  stroke-linecap: round;
`;

// The knob cap — a ribbed black disc with a soft highlight, the way controller knobs are moulded.
export const DialKnob = styled.circle`
  fill: color-mix(in oklab, white 14%, var(--rail-case));
  stroke: color-mix(in oklab, black 50%, var(--rail-case));
  stroke-width: 3;
`;

// The white pointer line on the knob that shows where it's turned to.
export const DialPointer = styled.line`
  stroke: var(--rail-case-text);
  stroke-width: 4;
  stroke-linecap: round;
`;

// The numeric value under the knob.
export const DialReadout = styled.output`
  font-family: ${MONO_FONT};
  font-size: 0.875rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

// "Slow / Fast"-style end labels either side of the readout.
export const DialEnds = styled.div`
  display: flex;
  justify-content: space-between;
  inline-size: 9rem;
  font-family: ${MONO_FONT};
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.7;
`;
