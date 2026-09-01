import { styled } from "@linaria/react";

export { Wrapper } from "@/components/GraphFrame/GraphFrame.styles";

// Small dot marking one resolved stop along the curve.
export const StopDot = styled.circle`
  fill: var(--color-bg-accent-emphasis);
  stroke: var(--color-bg-default);
  stroke-width: 2px;
`;
