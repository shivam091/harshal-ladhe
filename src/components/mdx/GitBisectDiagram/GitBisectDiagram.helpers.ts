import type { GitBisectCommitState, GitBisectDotStyle } from "@/components/mdx/GitBisectDiagram/GitBisectDiagram.types";

/*
  Maps a commit's state to the colours it renders with — "answer" reuses "bad"'s colours, since the first bad
  commit is still a bad commit, just now definitively identified (the component adds an extra ring for that).
*/
export function getBisectDotStyle(state: GitBisectCommitState): GitBisectDotStyle {
  switch (state) {
    case "good":
      return { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)", opacity: 1 };
    case "bad":
    case "answer":
      return { fill: "var(--color-bg-danger-muted)", stroke: "var(--color-border-danger-emphasis)", opacity: 1 };
    case "testing":
      return { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)", opacity: 1 };
    case "muted":
      return { fill: "var(--color-bg-default)", stroke: "var(--color-border-muted)", opacity: 0.35 };
    default:
      return { fill: "var(--color-bg-default)", stroke: "var(--color-border-default)", opacity: 1 };
  }
}
