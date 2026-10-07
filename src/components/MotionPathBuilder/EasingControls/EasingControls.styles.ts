import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// Curve preview beside the four number fields; stacks on narrow screens.
export const EasingBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
`;

// The small plot — drawn like a gradient profile on a layout plan, on a faint grid.
export const CurvePreview = styled.svg`
  flex: 0 0 auto;
  inline-size: 6.5rem;
  block-size: 6.5rem;
  background:
    linear-gradient(color-mix(in oklab, var(--color-border-muted) 70%, transparent) 0.0625rem, transparent 0.0625rem) 0 0 / 25% 25%,
    linear-gradient(90deg, color-mix(in oklab, var(--color-border-muted) 70%, transparent) 0.0625rem, transparent 0.0625rem) 0 0 / 25% 25%,
    var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

// The easing curve itself.
export const CurveLine = styled.path`
  fill: none;
  stroke: var(--rail-loco);
  stroke-width: 3;
  stroke-linecap: round;
`;

// Lines from the curve's ends to its control points.
export const CurveGuide = styled.line`
  stroke: var(--rail-timber-dark);
  stroke-width: 1.5;
  stroke-dasharray: 3 2;
`;

// The control point markers.
export const CurveHandle = styled.circle`
  fill: var(--rail-brass);
  stroke: var(--rail-timber-dark);
  stroke-width: 1.5;
`;

// Four labelled number fields for x1, y1, x2, y2.
export const BezierFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(4.5rem, 1fr));
  gap: 0.5rem;
  flex: 1 1 10rem;
`;

// The resolved timing function, as CSS will receive it.
export const EasingValue = styled.code`
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-fg-default);
  overflow-wrap: anywhere;
`;
