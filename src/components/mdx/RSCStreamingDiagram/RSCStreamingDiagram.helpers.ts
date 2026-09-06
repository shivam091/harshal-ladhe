import { PLOT_X0, PLOT_SCALE } from "@/components/mdx/RSCStreamingDiagram/RSCStreamingDiagram.constants";
import type { StreamingColorRole, StreamingRowColor } from "@/components/mdx/RSCStreamingDiagram/RSCStreamingDiagram.types";

// Maps a millisecond offset onto the plot's x-axis.
export function msToX(ms: number): number {
  return PLOT_X0 + ms * PLOT_SCALE;
}

// Maps a row's color role to its "visible" segment color — kept consistent across both lanes so the
// same tree segment reads as the same color whichever strategy it's shown under.
export function getStreamingRowColor(colorRole: StreamingColorRole): StreamingRowColor {
  switch (colorRole) {
    case "shell":
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
    case "list":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
    default:
      return { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" };
  }
}
