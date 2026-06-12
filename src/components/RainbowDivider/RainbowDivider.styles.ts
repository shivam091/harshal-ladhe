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

// Fixed footprint matching the reference divider; overflow stays visible so stretched or capped strokes aren't clipped.
export const Svg = styled.svg`
  display: block;
  overflow: visible;
  inline-size: 100px;
  block-size: 10px;
`;

/*
  Classes rather than styled components because react-spring's `animated()` and Linaria's
  `styled()` wrappers don't compose, so the animated paths can only be styled by className.
*/

/*
  Faint always-visible track each foreground line draws on top of. Full opacity — its faintness
  comes entirely from the muted stroke colour, not transparency.
*/
export const backgroundLineClass = css`
  stroke: var(--color-border-default);
  stroke-width: 2px;
  opacity: 1;
  vector-effect: non-scaling-stroke;
`;

/*
  The scroll-driven reveal is progressive enhancement — without view-timeline support the line is
  simply fully drawn. `pathLength={100}` keeps the dash math stable even while `d` animates.
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

  // A hard wipe rather than a colour fade so the hue stays true while the line draws in.
  @keyframes reveal-rainbow-line {
    from {
      stroke-dashoffset: 100;
    }

    to {
      stroke-dashoffset: 0;
    }
  }
`;
