import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Individual animated keycap rect — accent-colored so the keys pop against the frame's
// currentColor stroke; only its `y` (set via react-spring) moves.
export const Key = styled(animated.rect)`
  fill: var(--color-fg-accent);
`;
