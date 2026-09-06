import type { AppRouterFileNodeKind } from "@/components/mdx/AppRouterFileTreeDiagram/AppRouterFileTreeDiagram.constants";

// Fill/stroke pair for one node kind.
export interface AppRouterFileNodeColor {
  fill: string;
  stroke: string;
}

/*
  Maps a node's kind to the colors it renders with — folders stay neutral (they're organizational, not
  components), Server Component files (the default) render in the same "success" green used across the
  site's other diagrams, and the one forced-Client file (error.tsx) renders in "accent" to match the
  Client Component color used in ClientBoundaryPlacementDiagram.
*/
export function getAppRouterFileNodeColor(kind: AppRouterFileNodeKind): AppRouterFileNodeColor {
  switch (kind) {
    case "server":
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" };
    case "client":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
    default:
      return { fill: "var(--color-bg-muted)", stroke: "var(--color-border-default)" };
  }
}
