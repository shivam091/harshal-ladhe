import { styled } from "@linaria/react";

export { Wrapper } from "@/components/GraphFrame/GraphFrame.styles";

// Marks each stop so readers can see where the line is allowed to bend.
export const StopDot = styled.circle`
  fill: var(--color-bg-accent-emphasis);
  stroke: var(--color-bg-default);
  stroke-width: 2px;
`;
