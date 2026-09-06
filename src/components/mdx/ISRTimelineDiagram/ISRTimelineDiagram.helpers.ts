import type { ISRSegmentKind } from "@/components/mdx/ISRTimelineDiagram/ISRTimelineDiagram.constants";

// Fill/stroke pair for one segment kind.
export interface ISRSegmentColor {
  fill: string;
  stroke: string;
}

/*
  Maps a segment's kind to the colors it renders with: "fresh" reuses the same success green as
  every other diagram's "this is the good state" color, "stale" reuses the attention amber
  StreamingWaterfallDiagram uses for a fallback-shown state (still visible, just not the final
  content), "rebuilding" gets its own accent blue to read as "active work in progress," and "idle"
  stays neutral gray — nothing is happening.
*/
export function getISRSegmentColor(kind: ISRSegmentKind): ISRSegmentColor {
  switch (kind) {
    case "fresh":
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
    case "stale":
      return { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" };
    case "rebuilding":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
    default:
      return { fill: "var(--color-bg-neutral-muted)", stroke: "var(--color-border-neutral-muted)" };
  }
}
