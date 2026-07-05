import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

/*
  Kept apart from the base styles because @react-spring/web needs a client boundary while the
  variant styles must stay server-safe; animated rather than keyframed so the reveal shares the
  chevron boop's spring physics.
*/
export const DropIn = styled(animated.div)`
  will-change: transform;

  & > *:last-child {
    margin-block-end: 0;
  }
`;

// Unstyled so the toggle reads as part of the aside's text rather than a separate control.
export const ShowMore = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0;
  background: none;
  border: 0;
  font: inherit;
  color: var(--color-fg-default);
  font-weight: 700;
  cursor: pointer;
`;

// Animated wrapper so the chevron can nudge on hover.
export const ShowMoreChevron = styled(animated.span)`
  display: block;
`;
