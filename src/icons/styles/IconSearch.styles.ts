import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Positions the animated svg + shimmer glint together.
export const Wrapper = styled.span`
  position: relative;
  display: inline-block;
  transition: transform 300ms cubic-bezier(0.06, 0.63, 0.43, 1), opacity 300ms;
`;

/*
  Clips the glint to a lens-shaped patch; hidden in light theme, where a glass glint doesn't read
  against the pale tones.
*/
export const ShimmerWrapper = styled.span`
  position: absolute;
  inline-size: 50%;
  block-size: 45%;
  inset-block-start: 23%;
  inset-inline-end: 30%;
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
  Slides across the lens on hover; shimmer-in's fade is a best guess at the intended effect, so
  revisit it if the glint looks off.
*/
export const Shimmer = styled(animated.span)`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
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
