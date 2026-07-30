import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

/*
  flex-shrink: 0 keeps the heart from being compressed by the sidebar's flex column.
  data-floating turns it into a fixed pill where there's no table of contents to sit under;
  data-standalone drops the top separator for inline embeds that shouldn't float.
*/
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
  margin-block-start: 1.5rem;
  padding-block-start: 1rem;

  &[data-floating="true"],
  &[data-standalone="true"] {
    margin-block-start: 0;
    padding-block-start: 0;
    border-block-start: none;
  }

  /*
    Top-right, ~40% down the viewport — an explicit vh offset rather than an
    edge anchor so it reads as "docked partway down the page" instead of a
    corner-anchored FAB. Deliberately no padding/background/border/radius of
    its own — it's the same bare heart-and-count as the inline TOC placement,
    just escaped into fixed positioning, not a distinct "pill" chrome.
  */
  &[data-floating="true"] {
    position: fixed;
    inset-block-start: 40vh;
    inset-inline-end: 0.75rem;
    z-index: 1000;
  }
`;

// Relative-positioning slot for the button + its particle burst overlay, so the confetti can be sized/centred exactly over the heart.
export const ButtonSlot = styled.div`
  position: relative;
`;

/*
  Sits to the side so it never shifts the heart/count layout; each flash is a fresh mount, so
  the one-shot animation always replays rather than needing a transition to retrigger.
*/
export const Message = styled.span`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: calc(100% + 0.5rem);
  white-space: nowrap;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 50rem;
  padding: 0.1875rem 0.5rem;
  pointer-events: none;
  transform-origin: center;
  animation: like-message-float-up 2200ms ease-out both, fade-out 2200ms ease-out both;
  will-change: transform, opacity;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1ms;
  }

  @keyframes like-message-float-up {
    0% {
      transform: translateY(-50%) scale(1);
    }

    100% {
      transform: translateY(calc(-50% - 1.5rem)) scale(0.85);
    }
  }
`;

// Bounce wrapper — replays a short elastic pop each time the button is clicked.
export const BounceWrapper = styled.span`
  display: block;

  &[data-bounce="true"] {
    animation: like-button-bounce 500ms alternate cubic-bezier(0.17, 0.67, 0.54, 0.93);
    animation-iteration-count: 6;
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-bounce="true"] {
      animation: none;
    }
  }

  @keyframes like-button-bounce {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-20%);
    }
  }
`;

// A bare tap target with no chrome; animated so the press-boop spring can drive its style.
export const Button = styled(animated.button)`
  display: block;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  animation: fade-in 300ms cubic-bezier(0.25, 0.1, 0.25, 1) both;
`;

/*
  Holds the heart's colour tokens so the gradient and face retheme per data-theme; animated so
  the cursor-tracking rotation spring can drive its style.
*/
export const Svg = styled(animated.svg)`
  display: block;
  inline-size: 3rem;
  aspect-ratio: 50 / 42;

  --empty-heart-lower: hsl(225deg 15% 75%);
  --empty-heart-upper: hsl(225deg 40% 86%);
  --face-color: hsl(210deg 15% 6% / 0.5);
  --open-mouth-color: hsl(345deg 65% 30%);
  --tongue-color: hsl(350deg 64% 44%);

  [data-theme="dark"] &,
  [data-theme="soft-dark"] & {
    --empty-heart-lower: hsl(225deg 15% 75% / 0.5);
    --empty-heart-upper: hsl(225deg 40% 86% / 0.5);
    --face-color: hsl(210deg 15% 6% / 0.9);
    --open-mouth-color: hsl(345deg 65% 20%);
    --tongue-color: hsl(350deg 64% 40%);
  }
`;

/*
  z-index 1 keeps the count below code blocks (z-index 2) when the floating heart scrolls over
  one on small screens, while still painting above ordinary page content.
*/
export const Count = styled.span`
  position: relative;
  z-index: 1;
  font-size: 0.875rem;
  color: var(--color-fg-muted);
  font-variant-numeric: tabular-nums;
`;
