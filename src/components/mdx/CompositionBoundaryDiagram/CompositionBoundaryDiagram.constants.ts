import type { CompositionPanel } from "@/components/mdx/CompositionBoundaryDiagram/CompositionBoundaryDiagram.types";

// Vertical space allotted to each panel (title, two boxes, edge, and caption).
export const PANEL_H = 190;

// Top padding before the first panel.
export const TOP_PAD = 20;

// Shared horizontal center for every panel's node column.
export const NODE_CX = 280;

// Shared box dimensions for every node.
export const NODE_W = 190;
export const NODE_H = 42;

// Local y-coordinates (before each panel's vertical offset) shared by every panel.
export const TITLE_Y = 16;
export const TOP_BOX_Y = 26;
export const BOTTOM_BOX_Y = 112;
export const EDGE_TOP_Y = TOP_BOX_Y + NODE_H;
export const EDGE_BOTTOM_Y = BOTTOM_BOX_Y;
export const EDGE_MID_Y = (EDGE_TOP_Y + EDGE_BOTTOM_Y) / 2;
export const BADGE_CX_OFFSET = -110;
export const LABEL_X_OFFSET = 16;
export const NOTE_Y = BOTTOM_BOX_Y + NODE_H + 24;

/*
  The three scenarios the whole "composition rule" section hangs on: importing downward from a Server
  Component into a Client Component is fine, importing downward from a Client Component into a Server
  Component is blocked (client code has no server left to run that import on), and the escape hatch —
  a Server Component handed to a Client Component as already-rendered children — works because it's a
  data handoff, not an import. Panels 2 and 3 deliberately share the same top/bottom node arrangement
  so the only thing that changes between "blocked" and "the fix" is the edge itself.
*/
export const COMPOSITION_PANELS: CompositionPanel[] = [
  {
    title: "A Server Component imports a Client Component",
    topLabel: "Server Component",
    topKind: "server",
    bottomLabel: "Client Component",
    bottomKind: "client",
    edgeKind: "allowed-down",
    edgeLabel: "import",
    note: "Allowed — a Server Component can import and render any Client Component."
  },
  {
    title: "A Client Component tries to import a Server Component",
    topLabel: "Client Component",
    topKind: "client",
    bottomLabel: "Server Component",
    bottomKind: "server",
    edgeKind: "blocked",
    edgeLabel: "import",
    note: "Blocked — once you're in client code, there's no server left to run that import on."
  },
  {
    title: "The escape hatch: a Server Component passed in as children",
    topLabel: "Client Component",
    topKind: "client",
    bottomLabel: "Server Component",
    bottomKind: "server",
    edgeKind: "allowed-up",
    edgeLabel: "children prop",
    note: "Allowed — the parent already rendered it; this is data, not an import."
  }
];
