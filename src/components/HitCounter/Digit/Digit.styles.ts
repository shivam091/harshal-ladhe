import { styled } from "@linaria/react";

/*
  Each digit SVG — sized via size tokens, staggered entry animation.
  animation-delay is set via inline style from the parent for the per-digit stagger.
*/
export const DigitSvg = styled.svg`
  inline-size: var(--size-lg);
  block-size: var(--size-xl);
  display: block;
  animation:
    fade-in var(--motion-duration-medium) var(--motion-easing-ease) both,
    slide-down var(--motion-duration-medium) var(--motion-easing-ease) both;

  // Slide-in from above — settles from -50% translateY to its resting position, paired with fade-in for the per-digit stagger entrance.
  @keyframes slide-down {
    from {
      transform: translateY(-50%);
    }

    to {
      transform: translateY(0);
    }
  }
`;
