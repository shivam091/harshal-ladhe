import type { RenderCommitGroupKind } from "@/types/render-commit-diagram";
import type { RenderCommitGroupStyle } from "@/interfaces/render-commit-diagram";

/*
  Maps a group to its color set — render uses the accent palette, commit uses the attention palette,
  so a reader can trace "this box" back to "that band" the same way AxisDiagram's inline/block colors do.
*/
export function getRenderCommitGroupStyle(kind: RenderCommitGroupKind): RenderCommitGroupStyle {
  if (kind === "render") {
    return {
      bandFill: "var(--color-bg-muted)",
      bandStroke: "var(--color-border-accent-emphasis)",
      labelColor: "var(--color-fg-accent)",
      boxFill: "var(--color-bg-accent-muted)",
      boxStroke: "var(--color-border-accent-emphasis)"
    };
  }

  return {
    bandFill: "var(--color-bg-muted)",
    bandStroke: "var(--color-border-attention-emphasis)",
    labelColor: "var(--color-fg-attention)",
    boxFill: "var(--color-bg-attention-muted)",
    boxStroke: "var(--color-border-attention-emphasis)"
  };
}
