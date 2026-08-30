import type { Axis, AxisDiagramVariant } from "@/types/axis-diagram";

// Props for AxisDiagram — selects which writing-mode/direction config to render.
export interface AxisDiagramProps {
  // Which of the four writing-mode/direction configs to render.
  variant: AxisDiagramVariant;
}

// One edge's label: the logical term plus its physical-side hint.
export interface EdgeLabel {
  // e.g. "inline-start" — the logical term that applies to this physical edge for this variant.
  term: string;
  // e.g. "left" — the physical side this edge sits on, shown as a muted parenthetical under the term.
  physical: string;
  // Which axis (inline/block) this edge belongs to, used to color-match it to its arrow.
  axis: Axis;
}

// Props for EdgeText — renders one edge's two-line label at a given SVG position.
export interface EdgeTextProps {
  // The term/physical/axis triple to render for this edge.
  label: EdgeLabel;
  // SVG x coordinate shared by both lines of text.
  x: number;
  // SVG y coordinate of the term line; the physical hint renders 13px below it.
  y: number;
  // SVG text-anchor controlling horizontal alignment relative to (x, y).
  anchor: "start" | "middle" | "end";
}

// One writing-mode/direction variant's full diagram config: edge labels plus arrow geometry.
export interface AxisDiagramConfig {
  // Accessible label describing this variant's axis directions.
  ariaLabel: string;
  // Label rendered at the top edge.
  top: EdgeLabel;
  // Label rendered at the bottom edge.
  bottom: EdgeLabel;
  // Label rendered at the left edge.
  left: EdgeLabel;
  // Label rendered at the right edge.
  right: EdgeLabel;
  // Which axis the horizontal (crossing) arrow represents — the vertical arrow is always the other one.
  horizontalAxis: Axis;
  // Direction the horizontal arrow points: "start-to-end" is right, "end-to-start" is left.
  horizontalDirection: "start-to-end" | "end-to-start";
}
