import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// Label above the track; inherits its colour so the same slider reads on the light fascia and the dark controller case.
export const SliderLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: inherit;
`;

// One slider's label-over-track stack.
export const SliderField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-inline-size: 0;
`;

// Min/max bound beside the track, softened from whatever colour the panel uses.
export const SliderEdge = styled.span`
  flex: 0 0 auto;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  opacity: 0.7;
`;
