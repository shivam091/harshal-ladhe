import { styled } from "@linaria/react";

// Centers the plot — shared by every static graph (EasingCurveGraph, StepsEasingGraph, LinearEasingGraph) so they all frame identically.
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block: var(--space-xxxl);
`;

// Relative-positioned box containing the plot and its axis labels.
export const GraphPlot = styled.div`
  position: relative;
`;

// The plot's svg.
export const Svg = styled.svg`
  display: block;
  overflow: visible;
  touch-action: none;
  pointer-events: auto;
`;

// The L-shaped time/progress axis.
export const Axis = styled.path`
  fill: none;
  stroke: var(--color-border-default);
  stroke-width: 3px;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

// Shared styling for both axis captions.
const AxisLabel = styled.span`
  display: block;
  position: absolute;
  color: var(--color-fg-muted);
  font-size: var(--font-size-sm);
  user-select: none;
  text-align: center;
`;

// Rotated caption running up the plot's left edge.
export const VerticalAxisLabel = styled(AxisLabel)`
  inset-block-end: 0px;
  inset-inline-start: -4px;
  transform-origin: bottom left;
  transform: rotate(-90deg);
`;

// Caption running under the plot's bottom edge.
export const HorizontalAxisLabel = styled(AxisLabel)`
  inset-block-end: -28px;
`;
