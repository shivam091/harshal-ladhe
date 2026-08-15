import type { GitObjectKind, GitObjectNodeStyle } from "@/components/mdx/GitObjectGraphDiagram/GitObjectGraphDiagram.types";

/*
  Maps an object's kind to the colours its box renders with — one distinct colour per Git object type, so
  commits, trees, and blobs stay visually distinguishable at a glance.
*/
export function getObjectNodeStyle(kind: GitObjectKind): GitObjectNodeStyle {
  switch (kind) {
    case "commit":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
    case "tree":
      return { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" };
    default:
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
  }
}
