import { styled } from "@linaria/react";
import { skyFadeGradient } from "@/components/common.styles";
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
  padding-block-start: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background: linear-gradient(to bottom, var(--color-bg-sky-from), var(--color-bg-sky-to));
  overflow: clip;
  transition: background calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1);

  &[data-banner="sky-inner"] {
    background: ${skyFadeGradient("to bottom")};
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
  transition: fill calc(350ms + 120ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Mid-depth cloud fill — slightly slower than foreground to reinforce the parallax layering.
export const MidgroundClouds = styled.path`
  fill: var(--color-bg-cloud-300);
  transition: fill calc(350ms + 240ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Foreground cloud fill — transitions to the page background color on theme swap.
export const ForegroundClouds = styled.path`
  fill: var(--color-bg-default);
  transition: fill 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;
