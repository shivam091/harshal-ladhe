import type { GitObjectKind } from "@/types/git-object-graph-diagram";

// One object node in the graph: its box and which Git object type it is.
export interface GitObjectNode {
  // Left x coordinate of the node's box.
  x: number;
  // Top y coordinate of the node's box.
  y: number;
  // Width of the node's box.
  w: number;
  // Height of the node's box.
  h: number;
  // Text rendered inside the box.
  label: string;
  // Which object type this node represents, controlling its color.
  kind: GitObjectKind;
}

// One line connecting two object nodes.
export interface GitObjectEdge {
  // x coordinate the edge starts from.
  x1: number;
  // y coordinate the edge starts from.
  y1: number;
  // x coordinate the edge ends at.
  x2: number;
  // y coordinate the edge ends at.
  y2: number;
}

// Visual style for one object node: its fill and stroke color tokens.
export interface GitObjectNodeStyle {
  // Fill color token for the node's box.
  fill: string;
  // Stroke color token for the node's box border.
  stroke: string;
}
