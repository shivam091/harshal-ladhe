import { styled } from "@linaria/react";

// Fills PreviewPane exactly; a 0-100 viewBox lets every handle be positioned directly in the shape's own percentage space with no extra scaling math.
export const OverlaySvg = styled.svg`
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  /* Site-wide icon reset sets svg { pointer-events: none } (see SvgSnippet.styles.ts) — opt back in, since this SVG is the actual drag surface, not a decorative icon. */
  pointer-events: auto;
  touch-action: none;
  outline: none;
`;

// Visible outline of the shape currently being edited — non-scaling-stroke keeps its line weight constant even though the viewBox is stretched to fill an arbitrary aspect ratio.
export const ShapeOutline = styled.path`
  fill: none;
  stroke: var(--color-fg-accent);
  stroke-width: 0.6;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
`;

// Faint preview of Shape B while morph is enabled, rendered underneath the live outline so both endpoints stay visible at once.
export const GhostOutline = styled.path`
  fill: none;
  stroke: var(--color-fg-muted);
  stroke-width: 0.5;
  stroke-dasharray: 2 1.5;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
  opacity: 0.6;
`;

// Invisible, generously-stroked hit target laid over each edge so clicking anywhere along it (not just exactly on the 0.6-wide visible line) inserts a vertex there.
export const EdgeHitPath = styled.path`
  fill: none;
  stroke: transparent;
  stroke-width: 6;
  vector-effect: non-scaling-stroke;
  cursor: copy;
`;

// Thin connector between a curve vertex's anchor and one of its Bezier handles.
export const HandleLine = styled.line`
  stroke: var(--color-fg-muted);
  stroke-width: 0.4;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
`;

// A draggable vertex/center/edge point — square-ish sizing keeps it easy to grab without a huge visual footprint on a 0-100 viewBox.
export const VertexHandle = styled.circle`
  r: 2;
  fill: var(--color-bg-default);
  stroke: var(--color-fg-accent);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  cursor: grab;
  touch-action: none;

  &[data-selected="true"] {
    fill: var(--color-fg-accent);
  }

  &[data-active="true"] {
    cursor: grabbing;
  }
`;

// A curve vertex's own Bezier control-point handle — smaller and dimmer than the anchor it belongs to, so the anchor still reads as the "primary" point.
export const HandleDot = styled.circle`
  r: 1.4;
  fill: var(--color-bg-muted);
  stroke: var(--color-fg-muted);
  stroke-width: 0.8;
  vector-effect: non-scaling-stroke;
  cursor: grab;
  touch-action: none;

  &[data-selected="true"] {
    stroke: var(--color-fg-accent);
    fill: var(--color-fg-accent);
  }

  &[data-active="true"] {
    cursor: grabbing;
  }
`;

// Static (non-draggable) rect used only to visualize the inset family's box — the actual edges are dragged via the VertexHandle-styled circles positioned along it.
export const InsetOutline = styled.rect`
  fill: none;
  stroke: var(--color-fg-accent);
  stroke-width: 0.6;
  vector-effect: non-scaling-stroke;
  pointer-events: none;
`;
