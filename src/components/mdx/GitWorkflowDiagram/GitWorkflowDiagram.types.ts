// Props for GitWorkflowDiagram — selects which branching workflow to illustrate.
export interface GitWorkflowDiagramProps {
  // Which workflow to render: "github-flow", "git-flow", or "trunk-based".
  variant: GitWorkflowVariant;
}

// The three branching workflows this post's "Common Workflows" table compares.
export type GitWorkflowVariant = "github-flow" | "git-flow" | "trunk-based";

// How one commit node renders: a plain commit, a merge commit, or one of the three Git Flow branch types.
export type GitWorkflowNodeStyle = "default" | "merge" | "feature" | "release" | "hotfix";

// One commit node: its position, label, and render style.
export interface GitWorkflowNode {
  // x coordinate of the node's centre.
  x: number;
  // y coordinate of the node's centre.
  y: number;
  // Single-letter or short commit label.
  label: string;
  // Which style this node renders with, controlling its colour.
  style: GitWorkflowNodeStyle;
}

// One line connecting two commit nodes.
export interface GitWorkflowEdge {
  // x coordinate the edge starts from.
  x1: number;
  // y coordinate the edge starts from.
  y1: number;
  // x coordinate the edge ends at.
  x2: number;
  // y coordinate the edge ends at.
  y2: number;
}

// One row or branch-lane label, e.g. "main", "develop", "feature".
export interface GitWorkflowLabel {
  // Text to render.
  text: string;
  // x coordinate of the label.
  x: number;
  // y coordinate of the label.
  y: number;
  // Text-anchor alignment relative to (x, y).
  anchor: "start" | "middle" | "end";
}

// Visual style for one node style: its fill and stroke colour tokens.
export interface GitWorkflowNodeColor {
  // Fill colour token for the node's circle.
  fill: string;
  // Stroke colour token for the node's circle border.
  stroke: string;
}

// One variant's complete diagram, with its own viewBox since row counts differ sharply between variants.
export interface GitWorkflowVariantConfig {
  // SVG viewBox string sized for this variant's row count.
  viewBox: string;
  // Accessible title describing this variant's topology.
  title: string;
  // The commit nodes to render.
  nodes: GitWorkflowNode[];
  // The edges connecting those nodes.
  edges: GitWorkflowEdge[];
  // Row/branch-lane labels.
  labels: GitWorkflowLabel[];
  // Caption describing the workflow's key trait.
  caption: string;
  // x coordinate the caption is centred on.
  captionX: number;
  // y coordinate of the caption's baseline.
  captionY: number;
}
