import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Individual hash/plus stroke — colour transitions smoothly between currentColor and the enabled accent.
export const Line = styled(animated.line)`
  transition: stroke 250ms;
  stroke-linecap: round;
  stroke-linejoin: round;
`;
