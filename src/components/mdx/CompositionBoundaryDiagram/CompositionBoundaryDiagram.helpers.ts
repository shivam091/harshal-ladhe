import type { CompositionNodeKind, CompositionEdgeKind, CompositionNodeColor } from "@/components/mdx/CompositionBoundaryDiagram/CompositionBoundaryDiagram.types";

// Maps a node's kind to the colors its box renders with — matches the server/client colors used
// throughout the post's other diagrams, so "green = server, indigo = client" stays consistent.
export function getCompositionNodeColor(kind: CompositionNodeKind): CompositionNodeColor {
  return kind === "server"
    ? { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" }
    : { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
}

// Maps an edge's kind to the color its connecting line renders with.
export function getCompositionEdgeColor(kind: CompositionEdgeKind): string {
  switch (kind) {
    case "allowed-down":
      return "var(--color-border-success-emphasis)";
    case "allowed-up":
      return "var(--color-border-accent-emphasis)";
    default:
      return "var(--color-border-danger-emphasis)";
  }
}
