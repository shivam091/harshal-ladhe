import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";

// A window frame of heavy came around one light table, with its nameplate on top.
export const PaneFrame = styled.figure`
  display: flex;
  flex-direction: column;
  margin: 0;
  background: var(--came);
  border: 0.25rem solid var(--came);
  border-radius: 0.625rem;
  box-shadow: 0 0.5rem 1rem -0.5rem color-mix(in srgb, black 40%, transparent);
  overflow: hidden;
`;

// The frame's nameplate: which rule this pane obeys on the left, the ray origin's verdict on the right.
export const Nameplate = styled.figcaption`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem 0.75rem;
  padding: 0.375rem 0.625rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-bg-default);

  & code {
    font-family: inherit;
    font-weight: 800;
  }
`;

// The verdict tag — glass-tinted when the ray's origin sits in a filled pane, clear when it doesn't.
export const VerdictTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  font-weight: 700;
  color: var(--color-fg-default);
  background: color-mix(in oklab, var(--color-bg-default) 90%, transparent);
  border-radius: 999px;

  &[data-inside="true"] {
    background: color-mix(in oklab, var(--color-bg-default) 55%, var(--glass-cobalt));
  }

  &[data-rule="evenodd"][data-inside="true"] {
    background: color-mix(in oklab, var(--color-bg-default) 50%, var(--glass-amber));
  }
`;

/*
  The light table itself: a warm lamp glowing up through clear reeded glass. Square by construction
  so pointer percentages map straight onto the 400-unit viewBox. Every glass, came and laser colour
  below is a class hook, so the palette lives in CSS custom properties and follows the theme.
*/
export const TableSvg = styled.svg`
  display: block;
  inline-size: 100%;
  aspect-ratio: 1 / 1;
  background:
    repeating-linear-gradient(90deg, transparent 0 0.4375rem, color-mix(in oklab, var(--color-fg-default) 4%, transparent) 0.4375rem 0.5rem),
    radial-gradient(circle at 50% 42%, color-mix(in oklab, var(--glass-amber) 12%, var(--color-bg-default)), color-mix(in oklab, var(--glass-amber) 6%, var(--color-bg-muted)) 78%);
  border-radius: 0.375rem;
  cursor: crosshair;
  touch-action: manipulation;
  user-select: none;

  &[data-tool="probe"] {
    cursor: cell;
  }

  & .pane-nonzero {
    fill: var(--pane-nonzero);
  }

  & .pane-evenodd {
    fill: var(--pane-evenodd);
  }

  & .pane-texture {
    pointer-events: none;
  }

  & .streak {
    stroke: color-mix(in oklab, white 45%, transparent);
    stroke-width: 1.5;
    fill: none;
  }

  & .seed {
    fill: color-mix(in oklab, white 55%, transparent);
  }

  & .hatch-line {
    stroke: var(--glass-violet);
    stroke-width: 2.5;
  }

  & .clear-wash {
    fill: color-mix(in oklab, var(--color-bg-default) 78%, transparent);
  }

  & .clear-line {
    stroke: color-mix(in oklab, var(--color-fg-muted) 55%, transparent);
    stroke-width: 1.5;
  }

  & .tint-1 {
    fill: color-mix(in oklab, var(--glass-cobalt) 55%, transparent);
  }

  & .tint-2 {
    fill: color-mix(in oklab, var(--glass-violet) 65%, transparent);
  }

  & .tint--1 {
    fill: color-mix(in oklab, var(--glass-emerald) 55%, transparent);
  }

  & .tint--2 {
    fill: color-mix(in oklab, var(--glass-amber) 65%, transparent);
  }

  & .came {
    fill: none;
    stroke: var(--came);
    stroke-width: 6;
    stroke-linejoin: round;
    stroke-linecap: round;
  }

  & .came-heart {
    fill: none;
    stroke: var(--came-heart);
    stroke-width: 1.25;
    stroke-linejoin: round;
  }

  & .came-heart[data-active="true"] {
    stroke: var(--glass-amber);
    stroke-width: 2;
  }

  & .seam {
    stroke: var(--came);
    stroke-width: 5;
  }

  & .seam-label {
    font-family: ${MONO_FONT};
    font-size: 13px;
    font-weight: 800;
    fill: var(--color-fg-default);
    paint-order: stroke;
    stroke: var(--color-bg-default);
    stroke-width: 4;
  }

  & .chevron {
    fill: var(--color-bg-default);
    stroke: var(--came);
    stroke-width: 1.5;
    stroke-linejoin: round;
    pointer-events: none;
  }

  & .chevron[data-active="true"] {
    fill: var(--glass-amber);
  }

  & .laser-glow {
    stroke: color-mix(in oklab, var(--laser) 35%, transparent);
    stroke-width: 7;
    stroke-linecap: round;
    pointer-events: none;
  }

  & .laser-core {
    stroke: var(--laser);
    stroke-width: 2;
    stroke-dasharray: 10 5;
    pointer-events: none;
    animation: fill-rule-laser 1.2s linear infinite;
  }

  & .crossing-arrow {
    stroke-width: 2.5;
    stroke-linecap: round;
    fill: none;
  }

  & .crossing-arrow-head {
    stroke: none;
  }

  & [data-sign="1"] .crossing-arrow {
    stroke: var(--glass-cobalt);
  }

  & [data-sign="1"] .crossing-arrow-head {
    fill: var(--glass-cobalt);
  }

  & [data-sign="-1"] .crossing-arrow {
    stroke: var(--glass-emerald);
  }

  & [data-sign="-1"] .crossing-arrow-head {
    fill: var(--glass-emerald);
  }

  & .solder {
    fill: var(--color-bg-default);
    stroke: var(--laser);
    stroke-width: 2.5;
  }

  & .crossing-chip {
    fill: var(--color-bg-default);
    stroke: var(--came);
    stroke-width: 1.5;
  }

  & .crossing-label {
    font-family: ${MONO_FONT};
    font-size: 12px;
    font-weight: 800;
    fill: var(--color-fg-default);
  }

  & .aim-arm {
    stroke: var(--laser);
    stroke-width: 1.5;
    stroke-dasharray: 2 3;
  }

  @media (prefers-reduced-motion: reduce) {
    & .laser-core {
      animation: none;
    }
  }

  @keyframes fill-rule-laser {
    to {
      stroke-dashoffset: -15;
    }
  }
`;

/*
  Shared look for every draggable handle (anchors, controls, plumb bob, aim knob): a generous
  invisible hit circle plus a visible part, with focus and drag states drawn on the visible part
  because SVG groups can't show a native outline reliably.
*/
export const Handle = styled.g`
  cursor: grab;
  touch-action: none;
  outline: none;

  & .hit {
    fill: transparent;
  }

  & .vertex {
    fill: var(--color-bg-default);
    stroke: var(--came);
    stroke-width: 2.5;
  }

  &[data-active-subpath="true"] .vertex {
    fill: color-mix(in oklab, var(--color-bg-default) 40%, var(--glass-amber));
  }

  & .control {
    fill: var(--color-bg-default);
    stroke: var(--glass-violet);
    stroke-width: 2;
  }

  & .bob {
    fill: var(--laser);
    stroke: var(--came);
    stroke-width: 2;
  }

  & .knob {
    fill: color-mix(in oklab, var(--color-bg-default) 30%, var(--laser));
    stroke: var(--came);
    stroke-width: 2;
  }

  & .focus-ring {
    fill: none;
    stroke: var(--color-fg-accent);
    stroke-width: 2.5;
    opacity: 0;
  }

  &:focus-visible .focus-ring,
  &[data-selected="true"] .focus-ring,
  &[data-dragging="true"] .focus-ring {
    opacity: 1;
  }

  &[data-dragging="true"] {
    cursor: grabbing;
  }
`;

// Thin line from an anchor to one of its control points.
export const ControlArm = styled.line`
  stroke: var(--glass-violet);
  stroke-width: 1.5;
  stroke-dasharray: 3 3;
  pointer-events: none;
`;
