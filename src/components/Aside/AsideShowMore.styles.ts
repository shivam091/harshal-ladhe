import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

/*
  Split out from Aside.styles.ts: this file pulls in @react-spring/web,
  which needs a client boundary. Only Aside.tsx (a client component)
  imports it, keeping the variant *.styles.ts files server-safe.
*/

/*
  Reveal wrapper for <Expanded> content once "Show more" has been clicked — react-spring
  animated (via useTransformBoop in Aside.tsx) rather than a CSS keyframe, so the slide-in
  shares the same spring physics as the chevron boop.
*/
export const DropIn = styled(animated.div)`
  will-change: transform;

  & > *:last-child {
    margin-block-end: 0;
  }
`;

// Unstyled "Show more" toggle button — reveals the <expanded> content on click.
export const ShowMore = styled.button`
  appearance: none;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 0;
  background: none;
  border: 0;
  font: inherit;
  color: var(--color-fg-default);
  font-weight: var(--font-weight-bold);
  cursor: pointer;
`;

// Chevron icon slot inside ShowMore — react-spring animated for the hover boop nudge.
export const ShowMoreChevron = styled(animated.span)`
  display: block;
`;
