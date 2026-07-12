import { css } from "@linaria/core";

// Fixed scroll-to-top button — hidden until data-state="visible", then bounce-animates in from below.
export const scrollTopElement = css`
  position: fixed;
  inset-block-end: 2rem;
  inset-inline-end: 0.75rem;
  z-index: 1000;
  inline-size: 3rem;
  block-size: 3rem;
  padding: 0;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  // Starting offset for the bounce-in animation.
  transform: translateY(20px);

  /*
    Transition inset-inline-end (not \`right\`) to match the logical property used above,
    otherwise the responsive position change won't animate.
  */
  transition:
    inset-inline-end 150ms cubic-bezier(0.6, 0, 0.2, 1),
    background-color 150ms cubic-bezier(0.6, 0, 0.2, 1),
    color 150ms cubic-bezier(0.6, 0, 0.2, 1),
    border-color 150ms cubic-bezier(0.6, 0, 0.2, 1);
  will-change: transform, opacity;

  @media (width > 48rem) {
    inset-inline-end: 1rem;
  }

  // data-state is driven by JS scroll position; undefined = never shown, no animation plays.
  &[data-state="visible"] {
    animation: scroll-top-bounce-in 500ms both;
    pointer-events: auto;
    opacity: 1;
  }

  &[data-state="hidden"] {
    animation: scroll-top-bounce-out 500ms both;
    pointer-events: none;
    opacity: 0;
  }

  // Bounce-in animation for the scroll-to-top button — slides up from below the viewport with an elastic overshoot.
  @keyframes scroll-top-bounce-in {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      visibility: hidden;
    }

    60% {
      opacity: 1;
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
      opacity: 1;
      transform: translateY(0) scale(1);
      visibility: visible;
    }

    to {
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      visibility: hidden;
    }
  }
`;
