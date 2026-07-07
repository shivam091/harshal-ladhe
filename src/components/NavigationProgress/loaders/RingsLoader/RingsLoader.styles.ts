import { styled } from "@linaria/react";

// SVG wrapper for the triple-ring spinner — glow lifted from the bar's accent colour.
export const RingsSvg = styled.svg`
  position: relative;
  z-index: 1;
  inline-size: 80px;
  block-size: 80px;
  filter: drop-shadow(0 0 6px hsl(from var(--color-fg-accent) h s l / 0.45));
`;

/*
  Shared geometry for every ring — a plain SVG circle rotated around its own
  centre (cx="40" cy="40" in the SVG). transform-box: fill-box makes
  transform-origin: center work correctly for SVG shapes. Each variant below
  only adds its colour, arc length, and rotation.
*/
const Ring = styled.circle`
  transform-box: fill-box;
  transform-origin: center;
  fill: none;
  stroke-width: 2.5;
  stroke-linecap: round;
  will-change: transform;
`;

/*
  All three rings share the same "fast through the middle, slow at the ends" character as
  the middle ring's ease-in-out, but each gets its own symmetric cubic-bezier steepness (and
  a slightly different duration) instead of one identical curve, so the trio reads as related
  rather than perfectly synchronised.
*/

// Outer ring — attention colour, 3/4 arc, clockwise, gentlest ease + longest cycle.
export const OuterRing = styled(Ring)`
  stroke: var(--color-fg-attention);
  stroke-dasharray: 160 54;
  animation: spin 2.2s cubic-bezier(0.37, 0, 0.63, 1) infinite;
`;

// Middle ring — success colour, 2/3 arc, counter-clockwise, baseline ease-in-out feel.
export const MiddleRing = styled(Ring)`
  stroke: var(--color-fg-success);
  stroke-dasharray: 105 52;
  animation: spin 2s cubic-bezier(0.45, 0, 0.55, 1) infinite reverse;
`;

// Inner ring — accent colour, 1/2 arc, clockwise, sharpest ease + shortest cycle.
export const InnerRing = styled(Ring)`
  stroke: var(--color-fg-accent);
  stroke-dasharray: 50 51;
  animation: spin 1.8s cubic-bezier(0.33, 0, 0.67, 1) infinite;
`;
