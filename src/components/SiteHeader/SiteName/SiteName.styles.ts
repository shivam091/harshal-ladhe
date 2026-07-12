import { styled } from "@linaria/react";

/*
  Logo entry animations via @starting-style

  @starting-style defines where an element animates *from* on its very first
  render. Combined with a transition it replaces the old @keyframes approach —
  no animation-fill-mode, no JS, no explicit delays in keyframe blocks.

  Support: Chrome 117+, Safari 17.5+, Firefox 129+
  Fallback: elements appear at their final state immediately — still functional.
*/

// First name SVG text — slides in from the right and fades up on mount via @starting-style.
export const FirstName = styled.text`
  opacity: var(--opacity-full);
  transform: translateX(0);
  transition:
    opacity var(--motion-duration-slow) var(--motion-easing-overshoot) var(--motion-delay-long),
    transform var(--motion-duration-slow) var(--motion-easing-overshoot) var(--motion-delay-long);

  @starting-style {
    opacity: var(--opacity-none);
    transform: translateX(var(--space-sm));
  }
`;


// Last name SVG text — slides in from the left with a longer delay than the first name.
export const LastName = styled.text`
  opacity: var(--opacity-full);
  transform: translateX(0);
  transition:
    opacity var(--motion-duration-slow) var(--motion-easing-overshoot) var(--motion-delay-extra-long),
    transform var(--motion-duration-slow) var(--motion-easing-overshoot) var(--motion-delay-extra-long);

  @starting-style {
    opacity: var(--opacity-none);
    transform: translateX(calc(-1 * var(--space-sm)));
  }
`;

// The "V." SVG path draws itself from stroke-dashoffset: 100 → 0.
export const MiddleNameInitial = styled.path`
  inline-size: 1.5rem;
  block-size: 1.125rem;
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset var(--motion-duration-ultra-slow) var(--motion-easing-overshoot) calc(var(--motion-delay-extra-long) + var(--motion-delay-long));

  @starting-style {
    stroke-dashoffset: 100;
  }
`;
