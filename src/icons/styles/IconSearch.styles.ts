import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Positions the animated svg + shimmer glint together.
export const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  transition: transform 300ms cubic-bezier(0.06, 0.63, 0.43, 1), opacity 300ms;
`;

/*
  Clips the shimmer glint to a small lens-shaped patch inside the magnifying glass's circle.
  Hidden entirely in light theme — the shimmer reads as a glass glint that only makes sense
  against the dark/soft-dark themes' tones, matching the reference implementation's own
  light/dark split (there it's keyed off data-color-mode; this project uses data-theme).
*/
export const ShimmerWrapper = styled.span`
  position: absolute;
  width: 50%;
  height: 45%;
  top: 23%;
  right: 30%;
  border-radius: 50%;
  overflow: clip;
  transform: scale(0.85) rotate(-20deg);
  transform-origin: center center;
  transition: opacity 500ms;
  transition-delay: 400ms;

  :root[data-theme="light"] & {
    opacity: 0;
    transition: opacity 0ms;
    transition-delay: 0ms;
  }
`;

/*
  The glint itself — slides across the lens on hover via the transform spring passed in as
  `style` (see IconSearch.tsx). The reference source this was ported from only referenced
  `animation: shimmer ...` by name, without its @keyframes — shimmer-in below is a reasonable
  fade-in guess to fill that gap; flag it if it doesn't match the real effect.
*/
export const Shimmer = styled(animated.span)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0.5;
  animation: shimmer-in 400ms both;
  border-radius: 50%;

  :root[data-theme="light"] & {
    background: var(--color-bg-default);
    opacity: 1;
  }

  @keyframes shimmer-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

// Animated svg — transform-origin matches the circle's own center (11/24 of the 24-unit viewBox), not dead-center.
export const Svg = styled(animated.svg)`
  stroke: currentColor;
  display: block;
  overflow: visible;
  transform-origin: ${(11 / 24) * 100}% ${(11 / 24) * 100}%;
`;
