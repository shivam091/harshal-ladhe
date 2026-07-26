import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Whole glyph group — scaled by a brief spring "boop" pop on interaction; both cross-faded layers nest inside so they scale together.
export const Group = styled(animated.g)`
  transform-origin: center;
`;
