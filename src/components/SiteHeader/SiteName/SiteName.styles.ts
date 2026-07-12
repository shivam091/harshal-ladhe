import { styled } from "@linaria/react";

/*
  Logo entry animations via @starting-style

  @starting-style defines where an element animates *from* on its very first
  render. Combined with a transition it replaces the old @keyframes approach —
  no animation-fill-mode, no JS, no explicit delays in keyframe blocks.

  Support: Chrome 117+, Safari 17.5+, Firefox 129+
  Fallback: elements appear at their final state immediately — still functional.
*/

// Enters from the right so both names converge on the initial between them.
export const FirstName = styled.text`
  opacity: 1;
  transform: translateX(0);
  transition:
    opacity 500ms cubic-bezier(0.27, 0.22, 0.44, 1.03) 300ms,
    transform 500ms cubic-bezier(0.27, 0.22, 0.44, 1.03) 300ms;

  @starting-style {
    opacity: 0;
    transform: translateX(0.5rem);
  }
`;


// Enters a beat after the first name so the wordmark settles in reading order.
export const LastName = styled.text`
  opacity: 1;
  transform: translateX(0);
  transition:
    opacity 500ms cubic-bezier(0.27, 0.22, 0.44, 1.03) 500ms,
    transform 500ms cubic-bezier(0.27, 0.22, 0.44, 1.03) 500ms;

  @starting-style {
    opacity: 0;
    transform: translateX(calc(-1 * 0.5rem));
  }
`;

// Draws in only after both names land so the hand-drawn initial reads as the final flourish.
export const MiddleNameInitial = styled.path`
  inline-size: 1.5rem;
  block-size: 1.125rem;
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1000ms cubic-bezier(0.27, 0.22, 0.44, 1.03) calc(500ms + 300ms);

  @starting-style {
    stroke-dashoffset: 100;
  }
`;
