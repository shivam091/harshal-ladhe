// One box in a panel's component tree, positioned in panel-local coordinates (before panel translation).
export interface ClientBoundaryNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

// A straight connector line between two nodes, in the same panel-local coordinate space.
export interface ClientBoundaryEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/*
  Shared component tree, reused by both panels — only which nodes count as "client" differs between them.
  Page renders a Header, a Sidebar, and a Content area; Content renders an Article and a LikeButton, the
  one leaf that actually needs interactivity.
*/
export const CLIENT_BOUNDARY_NODES: ClientBoundaryNode[] = [
  { id: "page", x: 110, y: 18, w: 80, h: 28, label: "Page" },
  { id: "header", x: 20, y: 74, w: 70, h: 26, label: "Header" },
  { id: "sidebar", x: 115, y: 74, w: 70, h: 26, label: "Sidebar" },
  { id: "content", x: 210, y: 74, w: 70, h: 26, label: "Content" },
  { id: "article", x: 195, y: 128, w: 60, h: 26, label: "Article" },
  { id: "likebutton", x: 260, y: 128, w: 66, h: 26, label: "LikeButton" }
];

export const CLIENT_BOUNDARY_EDGES: ClientBoundaryEdge[] = [
  { x1: 150, y1: 46, x2: 55, y2: 74 },
  { x1: 150, y1: 46, x2: 150, y2: 74 },
  { x1: 150, y1: 46, x2: 245, y2: 74 },
  { x1: 245, y1: 100, x2: 225, y2: 128 },
  { x1: 245, y1: 100, x2: 298, y2: 128 }
];

// Panel A: "use client" placed on Page itself — every descendant ships as client JS.
export const PANEL_A_CLIENT_IDS = ["page", "header", "sidebar", "content", "article", "likebutton"];

// Panel B: "use client" pushed down to the one leaf that actually needs it.
export const PANEL_B_CLIENT_IDS = ["likebutton"];

// Shared panel dimensions and the x-translation each panel's <g> applies.
export const PANEL_W = 340;
export const PANEL_H = 170;
export const PANEL_A_X = 20;
export const PANEL_B_X = 400;
export const PANEL_Y = 50;
