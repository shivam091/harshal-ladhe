import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Flex column that stacks sky and cloud layers; clipped to the viewport height and behind content.
export const SkyBannerTopContainer = styled.div`
  display: flex;
  flex-direction: column;
  isolation: isolate;
  overflow: clip;
  max-block-size: 100vh;
  pointer-events: none;
  z-index: -1;
`;

// Absolute gradient sky layer — data-banner="sky-inner" switches to the taller inner-page gradient.
export const CloudLayers = styled.div`
  position: absolute;
  inset: 0 0 auto;
  padding-block-start: var(--space-xl);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background: linear-gradient(to bottom, var(--color-bg-sky-from), var(--color-bg-sky-to));
  overflow: clip;
  transition: background var(--sky-from-duration) var(--color-swap-timing-function);
  will-change: background;

  &[data-banner="sky-inner"] {
    background: linear-gradient(
      to bottom,
      hsl(from var(--color-bg-sky-subtle) h s l / 0.925),
      var(--color-bg-sky-subtle)
    );
  }
`;

// Panoramic SVG wider than any viewport; nudged 1 px down to close sub-pixel seam gaps.
export const CloudShapes = styled.svg`
  display: block;
  max-inline-size: revert;
  min-inline-size: 5120px;
  overflow: visible;
  transform: translateZ(0) translateY(1px);

  @media ${BREAKPOINTS.smMobileToMd} {
    min-inline-size: 670vw;
  }
`;

// Farthest cloud fill — transitions at the first-swoop speed for a depth-layered parallax feel.
export const BackgroundClouds = styled.path`
  fill: var(--color-bg-cloud-500);
  transition: fill var(--first-swoop-duration) var(--color-swap-timing-function);
  will-change: fill;
`;

// Mid-depth cloud fill — slightly slower than foreground to reinforce the parallax layering.
export const MidgroundClouds = styled.path`
  fill: var(--color-bg-cloud-300);
  transition: fill var(--second-swoop-duration) var(--color-swap-timing-function);
  will-change: fill;
`;

// Foreground cloud fill — transitions to the page background color on theme swap.
export const ForegroundClouds = styled.path`
  fill: var(--color-bg-default);
  transition: fill var(--color-swap-duration) var(--color-swap-timing-function);
  will-change: fill;
`;
