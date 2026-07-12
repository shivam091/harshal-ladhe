import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { REVEAL_END_PERCENT, REVEAL_STAGGER_STEP } from "@/components/RainbowDivider/RainbowDivider.constants";

// Unstyled button wrapping the SVG so the flip is a real, keyboard-reachable control rather than a div onClick.
export const DividerButton = styled.button`
  display: block;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  margin-block-start: 1rem;
  margin-inline: auto;
  inline-size: fit-content;
`;

// Root SVG — fixed 100px × 10px footprint, matching the reference divider's size.
export const Svg = styled.svg`
  display: block;
  overflow: visible;
  inline-size: 100px;
  block-size: 10px;
`;

/*
  Class (not a styled component) applied directly to react-spring's `animated.path`, since
  react-spring's `animated()` wrapper and Linaria's `styled()` wrapper don't compose — this is the
  same pattern SiteHeader.styles.ts uses (`logoImageClass`) to style a foreign component by className.
*/

/*
  Faint always-visible track each foreground line draws on top of. Full opacity — its faintness
  comes entirely from the muted stroke color, not transparency.
*/
export const backgroundLineClass = css`
  stroke: var(--color-border-default);
  stroke-width: 2px;
  opacity: 1;
  vector-effect: non-scaling-stroke;
`;

/*
  Drawn on top of backgroundLineClass, always at full solid `--color` (never a blended tone).
  Fully drawn by default; where `animation-timeline: view()` is supported, it instead draws in via
  `stroke-dashoffset` as the segment scrolls into view — a hard wipe, with the muted background
  line showing through the not-yet-drawn part. `pathLength={100}` on the path keeps the dash math
  stable even though `d` is separately animated (click flip / press-hold). Staggered left-to-right
  via `--index`, all segments finishing together at REVEAL_END_PERCENT.
*/
export const foregroundLineClass = css`
  stroke: var(--color);
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
  opacity: 1;
  vector-effect: non-scaling-stroke;

  @supports (animation-timeline: view()) {
    animation: reveal-rainbow-line linear both;
    animation-timeline: view();
    animation-range: cover calc(var(--index) * ${REVEAL_STAGGER_STEP}%) cover ${REVEAL_END_PERCENT}%;
  }

  // Draws the line in from nothing to fully revealed — a hard wipe, not a stroke color fade.
  @keyframes reveal-rainbow-line {
    from {
      stroke-dashoffset: 100;
    }

    to {
      stroke-dashoffset: 0;
    }
  }
`;
