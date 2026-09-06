import type { RevalidationSegment } from "@/components/mdx/RevalidationStrategiesDiagram/RevalidationStrategiesDiagram.constants";

// Fill/stroke pair for one segment's kind.
export interface RevalidationSegmentColor {
  fill: string;
  stroke: string;
}

// Same three-color vocabulary as RenderingStrategiesDiagram (static/stale/dynamic), kept as an
// independent copy so this diagram has no import dependency on that one.
export function getRevalidationSegmentColor(kind: RevalidationSegment["kind"]): RevalidationSegmentColor {
  switch (kind) {
    case "static":
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
    case "stale":
      return { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" };
    default:
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
  }
}
