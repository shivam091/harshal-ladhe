import type { GitWorkflowNodeStyle, GitWorkflowNodeColor } from "@/components/mdx/GitWorkflowDiagram/GitWorkflowDiagram.types";

/*
  Maps a node's style to the colors it renders with — merge commits and each Git Flow branch type get their
  own color, so a reader can trace which branch a node belongs to at a glance.
*/
export function getWorkflowNodeColor(style: GitWorkflowNodeStyle): GitWorkflowNodeColor {
  switch (style) {
    case "merge":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
    case "feature":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" };
    case "release":
      return { fill: "var(--color-bg-attention-muted)", stroke: "var(--color-border-attention-emphasis)" };
    case "hotfix":
      return { fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)" };
    default:
      return { fill: "var(--color-bg-muted)", stroke: "var(--color-border-default)" };
  }
}
