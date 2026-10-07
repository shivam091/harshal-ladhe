import { styled } from "@linaria/react";
import { HAND_FONT } from "@/components/ShapeToPathConverter/ShapeToPathConverter.styles";

// The legend row under the drawing, one entry per layer so the overlay can be read without guessing which line is which.
export const Legend = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// One legend entry: a short sample stroke followed by its name.
export const LegendItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;

  &::before {
    content: "";
    inline-size: 1.25rem;
    block-size: 0;
    border-block-start: 0.1875rem solid var(--legend-colour, currentColor);
    border-block-start-style: var(--legend-style, solid);
  }
`;

// Square, like a page of the book, so one user unit is the same size on both axes and a circle stays a circle.
export const CanvasFrame = styled.div`
  position: relative;
  inline-size: 100%;
  max-inline-size: 34rem;
  margin-inline: auto;
  aspect-ratio: 1;
  background: var(--book-paper);
  border: 0.0625rem solid color-mix(in srgb, var(--book-pencil) 50%, transparent);
`;

// The drawing surface; a 0–100 viewBox, the same grid the post's examples are drawn on.
export const CanvasSvg = styled.svg`
  display: block;
  inline-size: 100%;
  block-size: 100%;
  overflow: visible;
  /* Site-wide icon reset sets svg { pointer-events: none } — opt back in, since this SVG is the drag surface. */
  pointer-events: auto;
  touch-action: none;
  user-select: none;
`;

// One square of the exercise book's paper, as a pattern tile so it lines up exactly with user units.
export const GridLine = styled.path`
  fill: none;
  stroke: var(--book-grid);
  stroke-width: 0.15;
`;

// The ruler laid along the top and left edges; tick marks in pencil.
export const RulerTick = styled.line`
  stroke: var(--book-pencil);
  stroke-width: 0.2;
`;

// Ruler numbers, small enough to stay out of the way of the drawing.
export const RulerLabel = styled.text`
  font-size: 2.2px;
  fill: var(--book-pencil);
  font-family: system-ui, sans-serif;
`;

// The original element, drawn as a broad pencil shading so the thin ink path can be seen sitting inside it.
export const OriginalShape = styled.g`
  & > * {
    fill: color-mix(in srgb, var(--book-pencil) 14%, transparent);
    stroke: color-mix(in srgb, var(--book-pencil) 45%, transparent);
    stroke-width: 2.4;
    stroke-linejoin: round;
  }

  & > line,
  & > polyline {
    fill: none;
  }
`;

// The whole generated path in faint dashed ink, so the not-yet-drawn steps are still visible while scrubbing.
export const GhostPath = styled.path`
  fill: none;
  stroke: color-mix(in srgb, var(--book-ink) 40%, transparent);
  stroke-width: 0.35;
  stroke-dasharray: 1 1;
`;

// The path drawn so far, in biro.
export const InkPath = styled.path`
  fill: none;
  stroke: var(--book-ink);
  stroke-width: 0.6;
  stroke-linejoin: round;
  stroke-linecap: round;
`;

/*
  The hovered step traced over in red pen. Drawn in with a dash animation using pathLength="1",
  so the stroke always takes the same time regardless of the segment's real length.
*/
export const PenSegment = styled.path`
  fill: none;
  stroke: var(--book-pen);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: exercise-pen-trace 450ms ease-out;

  @keyframes exercise-pen-trace {
    from {
      stroke-dashoffset: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// Where the pen currently rests; a red ring for a hovered move, a biro dot for the scrubber's position.
export const PenMarker = styled.circle`
  fill: var(--color-bg-default);
  stroke: var(--marker-colour, var(--book-ink));
  stroke-width: 0.5;
`;

// The teacher's red-pen working marks on the drawing: dimension lines, radius arrows and their labels.
export const MarkLine = styled.line`
  stroke: var(--book-pen);
  stroke-width: 0.3;
  stroke-dasharray: 0.8 0.6;
`;

// Handwritten labels beside the red-pen marks.
export const MarkLabel = styled.text`
  font-family: ${HAND_FONT};
  font-size: 3px;
  fill: var(--book-pen);
  paint-order: stroke;
  stroke: var(--book-paper);
  stroke-width: 0.8;
`;

// The circled step number a teacher would write next to the line they are commenting on.
export const StepBadge = styled.g`
  & circle {
    fill: var(--color-bg-default);
    stroke: var(--book-pen);
    stroke-width: 0.35;
  }

  & text {
    font-family: ${HAND_FONT};
    font-size: 2.6px;
    fill: var(--book-pen);
    text-anchor: middle;
    dominant-baseline: central;
  }
`;

// The ruler strip beside a rect's top or left edge that its rx/ry handle slides along.
export const RadiusRuler = styled.g`
  & rect {
    fill: color-mix(in srgb, var(--color-fg-attention) 18%, var(--color-bg-default));
    stroke: var(--book-pencil);
    stroke-width: 0.15;
  }

  & line {
    stroke: var(--book-pencil);
    stroke-width: 0.15;
  }
`;

// The protractor drawn round a circle's or ellipse's centre, a nod to how a compass point is placed.
export const Protractor = styled.g`
  & path {
    fill: color-mix(in srgb, var(--color-fg-attention) 12%, transparent);
    stroke: var(--book-pencil);
    stroke-width: 0.15;
  }

  & line {
    stroke: var(--book-pencil);
    stroke-width: 0.12;
  }
`;

/*
  A draggable handle. Focusable for keyboard nudging; the focus ring is drawn as a red pen circle
  rather than the browser outline, which would be a rectangle around the group's bounding box.
*/
export const HandleGroup = styled.g`
  cursor: grab;
  outline: none;

  & .handle-hit {
    fill: transparent;
  }

  & .handle-mark {
    fill: var(--color-bg-default);
    stroke: var(--book-ink);
    stroke-width: 0.45;
    transition: fill 120ms ease;
  }

  & .handle-focus {
    fill: none;
    stroke: var(--book-pen);
    stroke-width: 0.4;
    opacity: 0;
  }

  &:hover .handle-mark,
  &[data-active="true"] .handle-mark {
    fill: var(--book-ink);
  }

  &:focus-visible .handle-focus {
    opacity: 1;
  }

  &[data-active="true"] {
    cursor: grabbing;
  }

  @media (prefers-reduced-motion: reduce) {
    & .handle-mark {
      transition: none;
    }
  }
`;

// Short line under the canvas explaining how to drive the handles without a pointer.
export const CanvasHint = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
