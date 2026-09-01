// Props for GitMergeDiagram — selects which merge outcome to illustrate.
export interface GitMergeDiagramProps {
  // Which merge outcome to render: "fast-forward" or "three-way".
  variant: GitMergeVariant;
}

// The two merge outcomes this post's own "Fast-Forward vs. Three-Way Merge" ASCII art compares.
export type GitMergeVariant = "fast-forward" | "three-way";

// One commit node: its position, label, and whether it's the newly-created commit in this panel.
export interface GitCommitNode {
  // x coordinate of the node's center.
  x: number;
  // y coordinate of the node's center.
  y: number;
  // Single-letter commit label, matching the post's own A/B/C/D/E/M naming.
  label: string;
  // Whether this node is newly created in this panel (styled distinctly), e.g. the three-way merge commit.
  emphasis: boolean;
}

// One line connecting two commit nodes.
export interface GitCommitEdge {
  // x coordinate the edge starts from.
  x1: number;
  // y coordinate the edge starts from.
  y1: number;
  // x coordinate the edge ends at.
  x2: number;
  // y coordinate the edge ends at.
  y2: number;
}

// Props for GitCommitPanel — renders one "before" or "after" commit graph.
export interface GitCommitPanelProps {
  // The commit nodes to render in this panel.
  nodes: GitCommitNode[];
  // The edges connecting those nodes.
  edges: GitCommitEdge[];
}

// One panel's full node/edge graph — GitMergeDiagram renders one of these for "before" and one for "after".
export interface GitMergePanelConfig {
  // The commit nodes in this panel.
  nodes: GitCommitNode[];
  // The edges connecting those nodes.
  edges: GitCommitEdge[];
}

// One variant's complete before/after comparison.
export interface GitMergeVariantConfig {
  // The commit graph before the merge.
  before: GitMergePanelConfig;
  // The commit graph after the merge.
  after: GitMergePanelConfig;
  // The git command that produces this outcome, shown between the two panels.
  captionCommand: string;
  // Short explanation of what that command does here, shown below the command.
  captionExplanation: string;
}
