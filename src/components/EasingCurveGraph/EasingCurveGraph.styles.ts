import { styled } from "@linaria/react";

export { Wrapper } from "@/components/GraphFrame/GraphFrame.styles";

// Ringed in the background colour so the point stays visible where it crosses the curve.
export const ControlPoint = styled.circle`
  fill: var(--color-bg-accent-emphasis);
  stroke: var(--color-bg-default);
  stroke-width: 2px;
`;
