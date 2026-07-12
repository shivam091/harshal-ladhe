import { css } from "@linaria/core";

// Fixed scroll-to-top button — hidden until data-state="visible", then bounce-animates in from below.
export const scrollTopElement = css`
  position: fixed;
  inset-block-end: var(--space-xl);
  inset-inline-end: var(--space-md);
  z-index: 1000;
  inline-size: 3rem;
  block-size: 3rem;
  padding: 0;
  opacity: var(--opacity-none);
  visibility: hidden;
  pointer-events: none;
  // Starting offset for the bounce-in animation.
  transform: translateY(20px);

  /*
    Transition inset-inline-end (not \`right\`) to match the logical property used above,
    otherwise the responsive position change won't animate.
  */
  transition:
    inset-inline-end var(--motion-duration-fast) var(--motion-easing-in-out),
    background-color var(--motion-duration-fast) var(--motion-easing-in-out),
    color var(--motion-duration-fast) var(--motion-easing-in-out),
    border-color var(--motion-duration-fast) var(--motion-easing-in-out);
  will-change: inset-inline-end, background-color, color, border-color, transform, opacity;

  @media (width > 48rem) {
    inset-inline-end: var(--space-base);
  }

  // data-state is driven by JS scroll position; undefined = never shown, no animation plays.
  &[data-state="visible"] {
    animation: scroll-top-bounce-in var(--motion-duration-slow) both;
    pointer-events: auto;
    opacity: var(--opacity-full);
  }

  &[data-state="hidden"] {
    animation: scroll-top-bounce-out var(--motion-duration-slow) both;
    pointer-events: none;
    opacity: var(--opacity-none);
  }

  // Bounce-in animation for the scroll-to-top button — slides up from below the viewport with an elastic overshoot.
  @keyframes scroll-top-bounce-in {
    from {
      opacity: var(--opacity-none);
      transform: translateY(20px) scale(0.95);
      visibility: hidden;
    }

    60% {
      opacity: var(--opacity-full);
      transform: translateY(-5px) scale(1.05);
      visibility: visible;
    }

    to {
      transform: translateY(0) scale(1);
      visibility: visible;
    }
  }

  // Bounce-out animation for the scroll-to-top button — slides back below the viewport and hides.
  @keyframes scroll-top-bounce-out {
    from {
      opacity: var(--opacity-full);
      transform: translateY(0) scale(1);
      visibility: visible;
    }

    to {
      opacity: var(--opacity-none);
      transform: translateY(20px) scale(0.95);
      visibility: hidden;
    }
  }
`;
