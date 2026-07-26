import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Whole glyph group — scaled by a brief spring "boop" pop on interaction.
export const Group = styled(animated.g)`
  transform-origin: center;
`;
