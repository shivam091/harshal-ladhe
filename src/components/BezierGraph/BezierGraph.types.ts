import type { ReactNode } from "react";
import type { BezierPoint } from "@/utils/bezier";

// Takes raw control points rather than a curve name, so editable curves can use it too.
export interface BezierGraphProps {
  // First control point.
  p1: BezierPoint;
  // Second control point.
  p2: BezierPoint;
  // Plot width/height in pixels (square).
  size: number;
  // Accessible label for the plot's svg.
  ariaLabel: string;
  // Y-axis caption. Defaults to "Progression".
  verticalLabel?: string;
  // X-axis caption. Defaults to "Time".
  horizontalLabel?: string;
  // Extra svg content layered above the curve, e.g. guide lines and drag handles.
  children?: ReactNode;
}
