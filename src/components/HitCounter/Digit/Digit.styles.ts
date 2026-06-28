import { styled } from "@linaria/react";

/*
  Staggers entry via sibling-index() so the parent needs no per-digit inline style;
  the plain 0ms delay stands where sibling-index() is unsupported and the calc() is ignored.
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

  // A starting style gives the mount-in fade and slide without a separate @keyframes pair.
  @starting-style {
    opacity: 0;
    transform: translateY(-50%);
  }
`;
