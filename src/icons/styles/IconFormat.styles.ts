import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Wand body — a fixed-size rounded bar that only rocks (rotates) on hover/press/format.
export const Wand = styled(animated.g)`
  transform-origin: 12px 12px;
`;

// One sparkle glyph — two crossing line-like polygons, animated as a unit.
export const StarGroup = styled(animated.g)`
  transform-origin: 18px 4px;
`;
