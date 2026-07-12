import { styled } from "@linaria/react";

/*
  Shrink-wrapped rather than full-width so it reads as a small centered divider, and so ball 0 sits
  flush against the left edge that the ball-center math measures from.
*/
export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  inline-size: fit-content;
  margin-inline: auto;
  margin-block: 1rem;
`;

// Clips the fill to a circle and keeps an outline so empty balls still read as a row.
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

// No transition, so the fill tracks the cursor 1:1 instead of lagging behind it.
export const BallFill = styled.span`
  display: block;
  inline-size: 100%;
  block-size: 100%;
  border-radius: 624.9375rem;
  background-color: var(--color);
  transform-origin: center bottom;
`;
