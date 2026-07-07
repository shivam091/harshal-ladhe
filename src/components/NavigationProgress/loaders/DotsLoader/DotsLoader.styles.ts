import { styled } from "@linaria/react";

// SVG wrapper for the orbiting-dots loader.
export const OrbitSvg = styled.svg`
  position: relative;
  z-index: 1;
  inline-size: 72px;
  block-size: 72px;
`;

// Faint static ring tracing each dot's path, purely for context — like a solar-system diagram.
export const OrbitGuide = styled.circle`
  fill: none;
  stroke: var(--color-border-default);
  stroke-width: 1;
  opacity: 0.18;
`;

/*
  Rotating pivot for one orbiting dot. `transform-box: view-box` + a `transform-origin` in
  view-box units (rather than `fill-box` + `center`) is required here: the dot itself sits
  off-centre within this <g>, so a fill-box origin would compute the *dot's* bounding-box
  centre and just spin it in place instead of sweeping it around (40, 40).

  Support: Chrome 128+, Safari 17.4+, Firefox 127+.
  Fallback: without `view-box` support the rotation falls back to each dot's own centre, so
  the dots sit still rather than orbiting — visible but static, never broken.
*/
const OrbitGroup = styled.g`
  transform-box: view-box;
  transform-origin: 40px 40px;
  will-change: transform;

  &[data-state="done"] {
    animation: none;
  }
`;

/*
  Each orbit gets its own symmetric curve, duration, and direction so the trio reads as a related
  family rather than one synchronised loop.
*/
export const OuterOrbitGroup = styled(OrbitGroup)`
  animation: spin 2.2s cubic-bezier(0.37, 0, 0.63, 1) infinite;
`;

export const MiddleOrbitGroup = styled(OrbitGroup)`
  animation: spin 2s cubic-bezier(0.45, 0, 0.55, 1) infinite reverse;
`;

export const InnerOrbitGroup = styled(OrbitGroup)`
  animation: spin 1.8s cubic-bezier(0.33, 0, 0.67, 1) infinite;
`;

/*
  Shared dot geometry — a small glowing circle. `transform-box: fill-box` is safe here
  (unlike on OrbitGroup above) because a dot's own bounding box IS centred on itself, so
  `transform-origin: center` scales it in place for the completion pop.
*/
const Dot = styled.circle`
  transform-box: fill-box;
  transform-origin: center;
  filter: drop-shadow(0 0 4px currentColor);
  transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);

  &[data-state="done"] {
    transform: scale(1.5);
  }
`;

export const OuterDot = styled(Dot)`
  fill: var(--color-fg-attention);
  color: var(--color-fg-attention);
`;

export const MiddleDot = styled(Dot)`
  fill: var(--color-fg-success);
  color: var(--color-fg-success);
`;

export const InnerDot = styled(Dot)`
  fill: var(--color-fg-accent);
  color: var(--color-fg-accent);
`;
