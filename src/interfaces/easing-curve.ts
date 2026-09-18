import type { BezierPoint } from "@/types/bezier";

// One named easing curve's control points plus the display label shown in prose and curve-picker dropdowns.
export interface EasingCurveDefinition {
  label: string;
  p1: BezierPoint;
  p2: BezierPoint;
}
