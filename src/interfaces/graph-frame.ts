import type { ReactNode } from "react";

// Props for GraphFrame — the shared axis+label chrome behind every timing-function graph (BezierGraph, StepsEasingGraph, LinearEasingGraph/Playground). Domain-agnostic: each caller supplies its own curve/marker svg content as children, plotted in whatever value domain it needs.
export interface GraphFrameProps {
  // Plot width/height in pixels (square).
  size: number;
  // Accessible label for the plot's svg.
  ariaLabel: string;
  // Y-axis caption. Defaults to "Progression".
  verticalLabel?: string;
  // X-axis caption. Defaults to "Time".
  horizontalLabel?: string;
  // Inset (in px) between the plot's edge and the drawn axis frame — lets a caller's axis line up with content plotted in a domain wider than [0,1] (e.g. linear()'s overshoot/undershoot). Defaults to 0.
  inset?: number;
  // The curve path and any marker/handle svg content, layered above the axis.
  children?: ReactNode;
}
