import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";

/*
  Column: heart button, then live like count below it. On post pages this is
  rendered as a sibling of TableOfContents (not a child — see the post
  layout), so it stays visible even on posts with no headings, where
  TableOfContents itself renders null; flex-shrink:0 keeps it from being
  compressed by PostTOC's flex column, which both share.

  data-floating="true" turns the same element into a persistent
  fixed-position pill — used unconditionally on pages with no Table of
  Contents at all (snippets, series), and on post pages once the post
  layout's own breakpoint check reports the TOC has collapsed.

  data-standalone="true" drops the same top separator, for callers that embed
  this somewhere with no heading list above it but that shouldn't escape to a
  fixed position either — e.g. LikeButtonDemo, embedded directly in blog prose.
*/
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xs);
  flex-shrink: 0;
  margin-block-start: var(--space-lg);
  padding-block-start: var(--space-base);
  border-block-start: var(--border-width-default) solid var(--color-border-default);

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
    inset-inline-end: var(--space-md);
    z-index: 1000;
  }
`;

// Relative-positioning slot for the button + its particle burst overlay, so the confetti can be sized/centered exactly over the heart.
export const ButtonSlot = styled.div`
  position: relative;
`;

/*
  Ephemeral "thanks for liking" / "already liked" bubble. Positioned to the
  side so it doesn't shift the heart/count layout, and drifts upward while
  scaling down and fading out over its lifetime — each flash is a fresh mount
  (keyed by the caller), so the one-shot animation always replays from the
  start rather than needing a transition to retrigger on a value change.
*/
export const Message = styled.span`
  position: absolute;
  inset-block-start: 50%;
  inset-inline-end: calc(100% + var(--space-sm));
  white-space: nowrap;
  font-size: var(--font-size-sm);
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: var(--border-width-default) solid var(--color-border-default);
  border-radius: var(--border-radius-pill);
  padding: var(--space-xxs) var(--space-sm);
  pointer-events: none;
  transform-origin: center;
  animation: like-message-float-up 2200ms ease-out both, fade-out 2200ms ease-out both;

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
    animation: like-button-bounce var(--motion-duration-slow) alternate cubic-bezier(0.17, 0.67, 0.54, 0.93);
    animation-iteration-count: 6;
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

// Reset button hosting the heart SVG — no chrome of its own, just a tap target. Wraps
// react-spring's animated.button so the press-boop scale spring can drive its style.
export const Button = styled(animated.button)`
  display: block;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  animation: fade-in var(--motion-duration-medium) var(--motion-easing-ease) both;
`;

/*
  Heart SVG — colour tokens for the empty/filled gradient and face features,
  themed per the site's light/dark/soft-dark data-theme attribute. Wraps
  react-spring's animated.svg so the cursor-tracking body-rotation spring can
  drive its style.
*/
export const Svg = styled(animated.svg)`
  display: block;
  inline-size: var(--size-xxxl);
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
  Live like count below the heart — bare number, muted. Explicitly positioned
  with a low z-index so it layers below CodeBlockWrapper (z-index: 2) when
  they visually overlap (e.g. the floating pill on small screens sliding over
  a code block while scrolling), while still painting above ordinary
  unpositioned page content.
*/
export const Count = styled.span`
  position: relative;
  z-index: 1;
  font-size: var(--font-size-sm);
  color: var(--color-fg-muted);
  font-variant-numeric: tabular-nums;
`;
