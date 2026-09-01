// One commit node: its position, label, and whether it's a new commit produced by the rebase (a new SHA).
export interface GitRebaseNode {
  // x coordinate of the node's center.
  x: number;
  // y coordinate of the node's center.
  y: number;
  // Commit label, matching the post's own A/B/C/D/E naming (with a trailing "'" for replayed commits).
  label: string;
  // Whether this node is a replayed commit with a new SHA, styled distinctly from the untouched ones.
  emphasis: boolean;
}

// One line connecting two commit nodes.
export interface GitRebaseEdge {
  // x coordinate the edge starts from.
  x1: number;
  // y coordinate the edge starts from.
  y1: number;
  // x coordinate the edge ends at.
  x2: number;
  // y coordinate the edge ends at.
  y2: number;
}
