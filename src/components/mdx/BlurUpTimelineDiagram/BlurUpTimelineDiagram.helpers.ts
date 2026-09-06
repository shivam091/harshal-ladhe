import { PLOT_X0, PLOT_SCALE } from "@/components/mdx/BlurUpTimelineDiagram/BlurUpTimelineDiagram.constants";
import type { BlurUpSegmentState, BlurUpSegmentColor } from "@/components/mdx/BlurUpTimelineDiagram/BlurUpTimelineDiagram.types";

// Maps a millisecond offset onto the plot's x-axis.
export function msToX(ms: number): number {
  return PLOT_X0 + ms * PLOT_SCALE;
}

// Maps a segment's state to how it renders: "blank" is a dashed, muted outline (nothing is actually
// on screen), "preview" is a solid but muted fill (something real, just low-fidelity, is on screen),
// and "sharp" is a solid, success-colored fill (the real photo the user actually wanted).
export function getBlurUpSegmentColor(state: BlurUpSegmentState): BlurUpSegmentColor {
  switch (state) {
    case "blank":
      return { fill: "var(--color-bg-muted)", stroke: "var(--color-border-muted)", dashed: true };
    case "preview":
      return { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)", dashed: false };
    default:
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)", dashed: false };
  }
}
