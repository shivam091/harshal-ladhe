import { styled } from "@linaria/react";

// Positioned absolutely so it sits behind the hero text and bleeds full-width.
export const HeroBannerContainer = styled.div`
  position: absolute;
  inset: 5rem 0 auto;
  isolation: isolate;
  background: var(--color-bg-sky-from);
  overflow: clip;
  margin-block-start: calc(-1 * 5rem - 2.75rem);
  padding-block-start: calc(5rem + 2.75rem);
  inline-size: 100vw;
  z-index: 0;
  pointer-events: none;
`;

// Stacked flex column so the SVG aligns to the bottom edge of each sky layer.
const SkyLayerBase = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  overflow: clip;
  transition: background calc(350ms + 500ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Back sky gradient layer — farthest depth, pulled up slightly to eliminate seams.
export const SkyLayerBack = styled(SkyLayerBase)`
  background: linear-gradient(to bottom, var(--color-bg-sky-from), var(--color-bg-sky-to));
  margin-block-start: calc(-1 * 2rem);
`;

// Absolute front layer (z-index 3) that holds the foreground cloud SVGs.
export const SkyLayerFront = styled(SkyLayerBase)`
  position: absolute;
  z-index: 3;
  inset: auto 0 0;
`;

// Wider than the viewport so cloud shapes fill any screen width; nudged 1 px down to close sub-pixel gaps.
export const SkySvg = styled.svg`
  display: block;
  max-inline-size: revert;
  min-inline-size: 320rem;
  --magic-number: calc(-50vw + 25rem);
  margin-block-start: -1rem;
  transform: translateZ(0) translate(var(--magic-number), 1px);

  @media (width > 48rem) {
    margin-block-start: 0;
    transform: translateZ(0) translateY(1px);
  }
`;

// Each cloud layer transitions fill independently at different speeds for a parallax-like depth effect.
export const CloudBackground = styled.path`
  fill: var(--color-bg-cloud-500);
  transition: fill calc(350ms + 120ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Mid-depth cloud fill — slower transition than foreground creates parallax depth.
export const CloudMidground = styled.path`
  fill: var(--color-bg-cloud-300);
  transition: fill calc(350ms + 240ms) cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Foreground cloud fill — transitions to the page background color on theme swap.
export const CloudForeground = styled.path`
  fill: var(--color-bg-default);
  transition: fill 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Pure-white star shapes visible against the sky gradient.
export const Star = styled.path`
  fill: hsl(0 0% 100%);
`;
