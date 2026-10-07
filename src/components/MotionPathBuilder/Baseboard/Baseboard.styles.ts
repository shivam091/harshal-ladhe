import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// The baseboard's timber surround and the card that holds it plus the playback strip.
export const BoardCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

/*
  The visible board: keeps the 480 × 300 aspect ratio at any width and clips the unscaled stage
  inside it. A thick timber lip round the felt sells it as a layout baseboard rather than a canvas.
*/
export const BoardFrame = styled.div`
  position: relative;
  inline-size: 100%;
  aspect-ratio: 480 / 300;
  overflow: hidden;
  border: 0.5rem solid var(--rail-timber-dark);
  border-radius: 0.25rem;
  box-shadow:
    inset 0 0 0 0.0625rem color-mix(in oklab, black 30%, transparent),
    0 0.25rem 0 color-mix(in oklab, black 25%, transparent);
  box-sizing: content-box;
`;

/*
  The stage at its true 480 × 300 CSS-pixel size, scaled to fit with a transform. Keeping it
  unscaled internally is what lets the preview run the exported path() string untouched — offset-path
  coordinates are pixels in the containing block, which is this element. The scenery felt is a
  few layered speckle gradients over the green, the texture of flock grass.
*/
export const Stage = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 480px;
  block-size: 300px;
  transform-origin: 0 0;
  background:
    radial-gradient(circle at 30% 40%, color-mix(in oklab, var(--rail-felt-deep) 70%, transparent) 0 0.08rem, transparent 0.1rem) 0 0 / 0.45rem 0.45rem,
    radial-gradient(circle at 70% 60%, color-mix(in oklab, white 14%, transparent) 0 0.06rem, transparent 0.08rem) 0 0 / 0.6rem 0.6rem,
    radial-gradient(ellipse at 20% 15%, color-mix(in oklab, var(--rail-felt-deep) 45%, transparent), transparent 45%),
    radial-gradient(ellipse at 85% 90%, color-mix(in oklab, var(--rail-felt-deep) 40%, transparent), transparent 40%),
    var(--rail-felt);
`;

// The editing surface — fills the stage and takes clicks on bare felt as "lay a pin here".
export const TrackSvg = styled.svg`
  position: absolute;
  inset: 0;
  display: block;
  inline-size: 100%;
  block-size: 100%;
  overflow: visible;
  cursor: crosshair;
  touch-action: none;

  &:focus-visible {
    outline: none;
  }
`;

// Ballast bed under the rails — wide, round-capped and a shade greyer than the felt.
export const Ballast = styled.path`
  fill: none;
  stroke: var(--rail-ballast);
  stroke-width: 22;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
`;

// Timber sleepers, drawn as a dashed stroke so they space themselves evenly along any curve.
export const Sleepers = styled.path`
  fill: none;
  stroke: var(--rail-sleeper);
  stroke-dasharray: 3 6;
  stroke-linejoin: round;
  pointer-events: none;
`;

// The pair of rails: a steel stroke, later hollowed by a narrower ballast stroke to leave two parallel lines.
export const RailSteel = styled.path`
  fill: none;
  stroke: var(--rail-steel);
  stroke-width: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
`;

// The gap between the rails, which hollows out RailSteel.
export const RailGap = styled.path`
  fill: none;
  stroke: var(--rail-ballast);
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
`;

// Brass direction chevrons painted between the rails.
export const Chevron = styled.path`
  fill: none;
  stroke: var(--rail-brass);
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
  pointer-events: none;
`;

// A buffer stop at each end of an open track, so the start and end read without a legend.
export const BufferStop = styled.g`
  pointer-events: none;

  & rect {
    fill: var(--rail-loco);
  }

  & text {
    font-family: ${MONO_FONT};
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.08em;
    fill: var(--color-fg-default);
    paint-order: stroke;
    stroke: var(--rail-felt);
    stroke-width: 3;
  }
`;

// Faint copies of the loco at evenly spaced moments of the run — the ghost trail that makes the easing visible.
export const GhostMarker = styled.g`
  fill: var(--rail-loco);
  opacity: 0.22;
  pointer-events: none;
`;

// Invisible fat stroke over each length of track, so a click anywhere near the rails inserts a pin.
export const EdgeHit = styled.path`
  fill: none;
  stroke: transparent;
  stroke-width: 18;
  cursor: copy;
`;

// Thin dashed line from a pin to each of its handles.
export const HandleLine = styled.line`
  stroke: var(--rail-brass);
  stroke-width: 1.25;
  stroke-dasharray: 3 2;
  pointer-events: none;
`;

/*
  A track pin: a round head with a highlight, like the steel pins that hold model track to the
  board. Selected pins glow brass; the focus ring is drawn as a stroke since SVG children can't
  take an outline.
*/
export const Pin = styled.circle`
  fill: color-mix(in oklab, var(--rail-steel) 70%, white);
  stroke: color-mix(in oklab, black 55%, var(--rail-steel));
  stroke-width: 2;
  cursor: grab;
  transition: r 120ms ease;

  &:hover {
    r: 8;
  }

  &[data-selected="true"] {
    fill: var(--rail-brass);
    stroke: color-mix(in oklab, var(--rail-brass) 40%, black);
  }

  &[data-corner="true"] {
    stroke-dasharray: 2 1.5;
  }

  &:focus-visible {
    outline: none;
    stroke: var(--color-fg-accent);
    stroke-width: 3.5;
  }

  &[data-active="true"] {
    cursor: grabbing;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// A curve handle: a small square so it's never confused with a pin.
export const HandleDot = styled.rect`
  fill: var(--rail-case-text);
  stroke: var(--rail-brass);
  stroke-width: 1.5;
  cursor: grab;

  &[data-selected="true"] {
    fill: var(--rail-brass);
  }

  &:focus-visible {
    outline: none;
    stroke: var(--color-fg-accent);
    stroke-width: 3;
  }
`;

/*
  The moving element, run by real CSS offset-path. Pinned to the stage's top-left so the path's
  coordinates mean the same thing here as in the export; pointer events are off so it never steals
  a click meant for the felt or a pin.
*/
export const Loco = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inline-size: 48px;
  block-size: 28px;
  color: var(--rail-loco);
  pointer-events: none;
  filter: drop-shadow(0 2px 1px color-mix(in oklab, black 35%, transparent));

  & svg {
    display: block;
    overflow: visible;
  }
`;

// A small cross at the loco's offset-anchor, so moving the anchor sliders shows exactly which point rides the rails.
export const AnchorMark = styled.span`
  position: absolute;
  inline-size: 8px;
  block-size: 8px;
  margin: -4px 0 0 -4px;
  border-radius: 50%;
  background: var(--rail-brass);
  box-shadow: 0 0 0 1.5px color-mix(in oklab, black 50%, transparent);
`;

// Caption under the board explaining the coordinate space the preview is drawing in.
export const BoardCaption = styled.p`
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.6875rem;
  line-height: 1.5;
  color: var(--color-fg-muted);
`;
