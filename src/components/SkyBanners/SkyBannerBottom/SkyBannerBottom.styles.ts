import { styled } from "@linaria/react";
import { skyFadeGradient } from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Full-width absolute bottom banner with a subtle sky gradient that transitions on theme swap.
export const SkyBannerBottomContainer = styled.div`
  position: absolute;
  inset: auto 0 0;
  block-size: 450px;
  z-index: -1;
  pointer-events: none;
  overflow: clip;
  background: ${skyFadeGradient("to top")};
  transition: background calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Right-anchored overlay SVG that sits above the bottom clouds
export const CloudLayersTopOverlay = styled.svg`
  display: block;
  position: absolute;
  inset: auto 50% 0 auto;
  z-index: 1;
  transform: translateZ(0);

  @media ${BREAKPOINTS.smMobileToMd} {
    transform: translate(80px);
  }
`;

// Top-overlay cloud fill — transitions at the first-swoop speed on theme change.
export const BottomCloudOverlay = styled.path`
  fill: var(--color-bg-sky-bottom);
  transition: fill calc(350ms + 120ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Wide panoramic cloud row
export const CloudLayersBottom = styled.div`
  position: absolute;
  inset: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: clip;
  margin-block-start: -1px;
`;

// Wide panoramic cloud SVG; overflows the banner width to prevent edge gaps.
export const CloudShapesBottom = styled.svg`
  display: block;
  margin-block-start: -1px;
  max-inline-size: revert;
  min-inline-size: 5120px;
  overflow: visible;
  transform: translateZ(0);
`;

// Background cloud fill — blends to the page background color on theme swap.
export const BottomBackgroundClouds = styled.path`
  fill: var(--color-bg-default);
  transition: fill 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;
