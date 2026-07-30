import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// A single emoji particle springing outward and fading out over its lifetime.
export const Emoji = styled(animated.span)`
  position: absolute;
  inset: 0;
  margin: auto;
  inline-size: fit-content;
  block-size: fit-content;
  line-height: 1;
  transform-origin: center center;
  animation: fade-out 750ms 200ms both;
  will-change: transform, opacity;
`;
