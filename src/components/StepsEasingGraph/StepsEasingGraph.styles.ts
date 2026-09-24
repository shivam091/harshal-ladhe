import { styled } from "@linaria/react";

export { Wrapper } from "@/components/GraphFrame/GraphFrame.styles";

// The staircase path: treads plus their connecting risers.
export const Curve = styled.path`
  stroke: var(--color-fg-accent);
  stroke-width: 5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`;

// A filled dot: the value is achieved exactly at this instant.
export const FilledDot = styled.circle`
  fill: var(--color-fg-accent);
  stroke: var(--color-bg-default);
  stroke-width: 2px;
`;

// An open dot: the tread ends here, but the value has already jumped on by this point.
export const OpenDot = styled.circle`
  fill: var(--color-bg-default);
  stroke: var(--color-fg-accent);
  stroke-width: 2px;
`;
