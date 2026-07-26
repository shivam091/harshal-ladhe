import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

// Rotation pivots on the glyph's own centre, matching its 24×24 viewBox.
export const RotatingGroup = styled(animated.g)`
  transform-origin: 12px 12px;
`;
