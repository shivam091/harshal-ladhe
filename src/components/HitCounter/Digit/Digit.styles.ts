import { styled } from "@linaria/react";

/*
  Each digit SVG — sized via size tokens, staggered entry animation.
  transition-delay reads the digit's own position via sibling-index() — no per-digit
  inline style from the parent. The plain 0ms fallback stands on browsers that don't
  support sibling-index() yet, since the calc() below is simply ignored there.
*/
export const DigitSvg = styled.svg`
  inline-size: 1.5rem;
  block-size: 2rem;
  display: block;
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 300ms cubic-bezier(0.25, 0.1, 0.25, 1),
    transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1);
  transition-delay: 0ms, 0ms;
  transition-delay:
    calc((sibling-index() - 1) * 100ms),
    calc((sibling-index() - 1) * 100ms);

  // Fades and slides in from above on mount — the "before" state a starting-style transition needs, in place of a from/to @keyframes pair.
  @starting-style {
    opacity: 0;
    transform: translateY(-50%);
  }
`;
