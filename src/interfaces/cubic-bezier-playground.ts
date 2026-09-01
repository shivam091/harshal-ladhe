import type { BezierPoint } from "@/types/bezier";

// Props for CubicBezierPlayground — the draggable two-handle cubic-bezier() editor.
export interface CubicBezierPlaygroundProps {
  // Starting P1 control point. Defaults to a gentle ease-in-out-ish handle.
  initialP1?: BezierPoint;
  // Starting P2 control point.
  initialP2?: BezierPoint;
  // Plot width/height in pixels (square). Defaults to 260.
  size?: number;
}
