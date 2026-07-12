import { styled } from "@linaria/react";

/*
  Row of ball wrappers, shrink-wrapped to its content rather than stretched full-width — it reads as
  a small centered divider, and getBallCenter's math assumes ball 0 sits flush against this box's
  left edge, which only holds if the box is exactly as wide as its balls/gaps.
*/
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  inline-size: fit-content;
  margin-inline: auto;
  margin-block: 1rem;
`;

// A single ball's outline/clip — BallFill is the only thing that actually paints color inside it.
export const BallWrapper = styled.span`
  position: relative;
  flex-shrink: 0;
  inline-size: 1rem;
  block-size: 1rem;
  border-radius: 624.9375rem;
  overflow: hidden;
  outline: 0.0625rem solid var(--color-border-default);
  outline-offset: 1px;
`;

// The colored fill — scale and blur are set directly (no easing) from FooterDivider.tsx, so it tracks the cursor 1:1.
export const BallFill = styled.span`
  display: block;
  inline-size: 100%;
  block-size: 100%;
  border-radius: 624.9375rem;
  background-color: var(--color);
  transform-origin: center bottom;
`;
