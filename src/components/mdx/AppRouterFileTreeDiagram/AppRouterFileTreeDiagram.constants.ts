// One kind of file-tree node: a plain folder (no rendering behavior of its own), a Server Component
// (the App Router default), or a Client Component (forced by the framework, e.g. error.tsx).
export type AppRouterFileNodeKind = "folder" | "server" | "client";

// One box in the tree: a folder or a special file, positioned in the diagram's local coordinate space.
export interface AppRouterFileNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  kind: AppRouterFileNodeKind;
}

// A straight connector line from a parent node's bottom edge to a child node's top edge.
export interface AppRouterFileEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// A short two-line annotation anchored under a specific node, calling out what's special about it.
export interface AppRouterFileNote {
  cx: number;
  y1: number;
  y2: number;
  line1: string;
  line2: string;
}

const ROW1_W = 90;
const ROW1_H = 32;
const ROW1_Y = 100;

const ROW2_W = 80;
const ROW2_H = 32;
const ROW2_Y = 190;

/*
  Every node in the tree: the app/ root, its 5 direct children (4 special files + the dashboard/ segment),
  and dashboard/'s own 3 children. error.tsx is the one node whose "kind" the reader should notice breaks
  the pattern — every other file defaults to "server", but error.tsx is forced to "client".
*/
export const APP_ROUTER_FILE_NODES: AppRouterFileNode[] = [
  { id: "root", x: 205, y: 20, w: ROW1_W, h: ROW1_H, label: "app/", kind: "folder" },

  { id: "layout", x: 10, y: ROW1_Y, w: ROW1_W, h: ROW1_H, label: "layout.tsx", kind: "server" },
  { id: "page", x: 110, y: ROW1_Y, w: ROW1_W, h: ROW1_H, label: "page.tsx", kind: "server" },
  { id: "loading", x: 210, y: ROW1_Y, w: ROW1_W, h: ROW1_H, label: "loading.tsx", kind: "server" },
  { id: "error", x: 310, y: ROW1_Y, w: ROW1_W, h: ROW1_H, label: "error.tsx", kind: "client" },
  { id: "dashboard", x: 410, y: ROW1_Y, w: ROW1_W, h: ROW1_H, label: "dashboard/", kind: "folder" },

  { id: "dash-layout", x: 327, y: ROW2_Y, w: ROW2_W, h: ROW2_H, label: "layout.tsx", kind: "server" },
  { id: "dash-page", x: 415, y: ROW2_Y, w: ROW2_W, h: ROW2_H, label: "page.tsx", kind: "server" },
  { id: "dash-loading", x: 503, y: ROW2_Y, w: ROW2_W, h: ROW2_H, label: "loading.tsx", kind: "server" }
];

// Root (app/) fans out to its 5 direct children, and dashboard/ fans out to its own 3 children —
// the same "parent fans out to children" shape GitObjectGraphDiagram uses for commit → tree → blobs.
export const APP_ROUTER_FILE_EDGES: AppRouterFileEdge[] = [
  { x1: 250, y1: 52, x2: 55, y2: ROW1_Y },
  { x1: 250, y1: 52, x2: 155, y2: ROW1_Y },
  { x1: 250, y1: 52, x2: 255, y2: ROW1_Y },
  { x1: 250, y1: 52, x2: 355, y2: ROW1_Y },
  { x1: 250, y1: 52, x2: 455, y2: ROW1_Y },

  { x1: 455, y1: ROW1_Y + ROW1_H, x2: 367, y2: ROW2_Y },
  { x1: 455, y1: ROW1_Y + ROW1_H, x2: 455, y2: ROW2_Y },
  { x1: 455, y1: ROW1_Y + ROW1_H, x2: 543, y2: ROW2_Y }
];

// The two nodes whose rendering rule most surprises a reader coming from the Pages Router: loading.tsx
// quietly becomes a Suspense boundary, and error.tsx is the one file the framework forces to be a Client
// Component (an error boundary needs class-lifecycle state no Server Component can hold).
export const APP_ROUTER_FILE_NOTES: AppRouterFileNote[] = [
  { cx: 255, y1: 148, y2: 160, line1: "auto Suspense", line2: "boundary" },
  { cx: 355, y1: 148, y2: 160, line1: "forced client", line2: "(needs state)" }
];
