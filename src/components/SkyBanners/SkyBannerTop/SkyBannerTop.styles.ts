import { styled } from "@linaria/react";
import { skyFadeGradient } from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Isolated and clipped to the viewport so the decoration never overlaps content or grows the page.
export const SkyBannerTopContainer = styled.div`
  display: flex;
  flex-direction: column;
  isolation: isolate;
  overflow: clip;
  max-block-size: 100vh;
  pointer-events: none;
  z-index: -1;
`;

// Inner pages fade the sky out sooner so the gradient doesn't compete with long-form reading.
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
  transition:
    --color-bg-sky-from calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1),
    --color-bg-sky-to calc(350ms + 350ms) cubic-bezier(0.41, 0.1, 0.13, 1),
    --color-bg-sky-subtle calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1);

  &[data-banner="sky-inner"] {
    background: ${skyFadeGradient("to bottom")};
  }
`;

// Wider than any viewport so no edge shows; the 1px nudge closes sub-pixel seams at the bottom.
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

// Per-layer timings stagger the theme swap so it sweeps through the clouds with a sense of depth.
export const BackgroundClouds = styled.path`
  fill: var(--color-bg-cloud-500);
  transition: fill calc(350ms + 120ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Lags the other layers to reinforce the depth staggering.
export const MidgroundClouds = styled.path`
  fill: var(--color-bg-cloud-300);
  transition: fill calc(350ms + 240ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Matches the page background so the clouds melt seamlessly into the content below.
export const ForegroundClouds = styled.path`
  fill: var(--color-bg-default);
  transition: fill 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;
