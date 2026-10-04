import { styled } from "@linaria/react";

// Thick, round-capped stroke so the curve reads clearly at small sizes.
export const Curve = styled.path`
  stroke: var(--color-fg-accent);
  stroke-width: 5px;
  stroke-linecap: round;
  fill: none;
`;

// Shows which fixed anchor each control point pulls on, the way browser DevTools curve editors do.
export const GuideLine = styled.line`
  stroke: var(--color-fg-muted);
  stroke-width: 2px;
  stroke-dasharray: 4 4;
  opacity: 0.5;
`;
