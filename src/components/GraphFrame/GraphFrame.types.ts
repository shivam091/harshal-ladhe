import type { ReactNode } from "react";

// Domain-agnostic so the frame never constrains what a graph plots inside it.
export interface GraphFrameProps {
  // Plot width/height in pixels (square).
  size: number;
  // Accessible label for the plot's svg.
  ariaLabel: string;
  // Y-axis caption. Defaults to "Progression".
  verticalLabel?: string;
  // X-axis caption. Defaults to "Time".
  horizontalLabel?: string;
  // Inset (px) of the axis frame from the plot edge — lets the axis line up with content plotted in a domain wider than [0,1] (e.g. linear()'s overshoot). Defaults to 0.
  inset?: number;
  // The curve path and any marker/handle svg content, layered above the axis.
  children?: ReactNode;
}
