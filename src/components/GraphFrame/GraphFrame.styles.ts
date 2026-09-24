import { styled } from "@linaria/react";

// Centres the plot so every static graph frames identically.
export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-block: 4rem;
`;

// Positioning context so the axis captions can sit outside the svg's bounds.
export const GraphPlot = styled.div`
  position: relative;
`;

// Overflow stays visible so curves that overshoot the axis frame aren't clipped; touch-action none keeps drags from scrolling the page.
export const Svg = styled.svg`
  display: block;
  overflow: visible;
  touch-action: none;
  pointer-events: auto;
`;

// L-shaped time/progress axis — muted so it frames the curve without competing with it.
export const Axis = styled.path`
  fill: none;
  stroke: var(--color-border-default);
  stroke-width: 3px;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

// Keeps both axis captions visually identical and non-selectable.
const AxisLabel = styled.span`
  display: block;
  position: absolute;
  color: var(--color-fg-muted);
  font-size: 0.875rem;
  user-select: none;
  text-align: center;
`;

// Rotated to run up the left edge, reading like a conventional y-axis label.
export const VerticalAxisLabel = styled(AxisLabel)`
  inset-block-end: 0px;
  inset-inline-start: -4px;
  transform-origin: bottom left;
  transform: rotate(-90deg);
`;

// Offset below the plot so it clears the bottom axis line.
export const HorizontalAxisLabel = styled(AxisLabel)`
  inset-block-end: -28px;
`;
