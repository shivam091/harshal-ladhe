import { styled } from "@linaria/react";

/*
  Hard light/dark stripes make any blending with the backdrop obvious. The stage is isolated itself, so even the
  unisolated case stops blending at the stripes instead of reaching the page behind the post.
*/
export const Stage = styled.div`
  position: relative;
  isolation: isolate;
  display: flex;
  justify-content: center;
  padding-block: 1.25rem;
  background: repeating-linear-gradient(90deg, #f4efe6 0 2.5rem, #1e2430 2.5rem 5rem);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
  overflow: clip;
`;

// Fixed-size box the circles are placed in, so their overlap pattern is identical at every viewport width.
export const Group = styled.div`
  position: relative;
  inline-size: 12rem;
  block-size: 9.5rem;
`;

// One blended circle; its placement comes from a per-circle custom property set in the component.
export const Circle = styled.div`
  position: absolute;
  inset-block-start: var(--top);
  inset-inline-start: var(--left);
  inline-size: 6.5rem;
  block-size: 6.5rem;
  border-radius: 50%;
  background: var(--fill);
`;
