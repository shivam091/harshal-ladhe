import { styled } from "@linaria/react";

/*
  Each digit SVG — sized via size tokens, staggered entry animation.
  animation-delay is set via inline style from the parent for the per-digit stagger.
*/
export const DigitSvg = styled.svg`
  inline-size: 1.5rem;
  block-size: 2rem;
  display: block;
  animation:
    fade-in 300ms cubic-bezier(0.25, 0.1, 0.25, 1) both,
    slide-down 300ms cubic-bezier(0.25, 0.1, 0.25, 1) both;

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
