import type { GitObjectNode, GitObjectEdge } from "@/components/mdx/GitObjectGraphDiagram/GitObjectGraphDiagram.types";

/*
  The post's own example object graph: one commit, pointing at its root tree, which fans out to two file
  blobs and a nested subtree, which itself points at one more file blob.
*/
export const OBJECT_NODES: GitObjectNode[] = [
  { x: 198, y: 26, w: 84, h: 43, label: "commit", kind: "commit" },
  { x: 186, y: 110, w: 108, h: 43, label: "tree", kind: "tree" },
  { x: 18, y: 206, w: 144, h: 43, label: "blob (index.js)", kind: "blob" },
  { x: 180, y: 206, w: 132, h: 43, label: "blob (styles.css)", kind: "blob" },
  { x: 330, y: 206, w: 132, h: 43, label: "tree (src/)", kind: "tree" },
  { x: 330, y: 302, w: 132, h: 43, label: "blob (utils.js)", kind: "blob" }
];

/*
  Edges connecting the nodes above, in the same order: commit to root tree, root tree fanning out to its
  three children, and the nested tree down to its own blob.
*/
export const OBJECT_EDGES: GitObjectEdge[] = [
  { x1: 240, y1: 69, x2: 240, y2: 110 },
  { x1: 240, y1: 153, x2: 90, y2: 206 },
  { x1: 240, y1: 153, x2: 246, y2: 206 },
  { x1: 240, y1: 153, x2: 396, y2: 206 },
  { x1: 396, y1: 249, x2: 396, y2: 302 }
];
