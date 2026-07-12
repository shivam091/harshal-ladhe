import { styled } from "@linaria/react";
import { skyFadeGradient } from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Sits behind content and ignores pointer events so the decoration never blocks the footer.
export const SkyBannerBottomContainer = styled.div`
  position: absolute;
  inset: auto 0 0;
  block-size: 450px;
  z-index: -1;
  pointer-events: none;
  overflow: clip;
  background: ${skyFadeGradient("to top")};
  transition: --color-bg-sky-subtle calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// A separate overlay layer adds depth in front of the cloud row.
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

// Offset timing staggers the theme swap across layers instead of flipping them all at once.
export const BottomCloudOverlay = styled.path`
  fill: var(--color-bg-sky-bottom);
  transition: fill calc(350ms + 120ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Clips the oversized cloud SVG so it can't cause horizontal page scroll.
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

// Wider than any viewport so no screen size ever reveals the cloud edge.
export const CloudShapesBottom = styled.svg`
  display: block;
  margin-block-start: -1px;
  max-inline-size: revert;
  inline-size: 5120px;
  overflow: visible;
  transform: translateZ(0);

  @media ${BREAKPOINTS.mobile} {
    inline-size: 670vw;
  }
`;

// Matches the page background so the clouds melt seamlessly into the content above.
export const BottomBackgroundClouds = styled.path`
  fill: var(--color-bg-default);
  transition: fill 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;
