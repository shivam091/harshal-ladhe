// Which kind of component a node represents, controlling its color.
export type CompositionNodeKind = "server" | "client";

/*
  How a panel's edge should render: "allowed-down" is a normal import (arrow points at the imported
  component), "blocked" is an import that can't work (dashed, crossed out, no arrowhead), and
  "allowed-up" is the escape hatch — an already-rendered component handed up into a slot, so the
  arrow points the opposite way from a normal import.
*/
export type CompositionEdgeKind = "allowed-down" | "blocked" | "allowed-up";

// One panel: two stacked nodes, the edge connecting them, and a one-line verdict.
export interface CompositionPanel {
  // Short heading describing the scenario.
  title: string;
  // Label of the top node.
  topLabel: string;
  topKind: CompositionNodeKind;
  // Label of the bottom node.
  bottomLabel: string;
  bottomKind: CompositionNodeKind;
  // How the edge between the two nodes renders.
  edgeKind: CompositionEdgeKind;
  // Short label on the edge itself, e.g. "import" or "children prop".
  edgeLabel: string;
  // One-line verdict/explanation shown under the panel.
  note: string;
}

// Fill/stroke pair for one node's box.
export interface CompositionNodeColor {
  fill: string;
  stroke: string;
}
