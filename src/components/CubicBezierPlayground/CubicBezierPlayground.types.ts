import type { BezierPoint } from "@/utils/bezier";

// Starting points are configurable so a post can open the playground on the curve it's discussing.
export interface CubicBezierPlaygroundProps {
  // Starting P1. Defaults to [0.65, 0] — with P2's default, a strong ease-in-out with obvious character.
  initialP1?: BezierPoint;
  // Starting P2. Defaults to [0.35, 1].
  initialP2?: BezierPoint;
  // Plot width/height in pixels (square). Defaults to 260.
  size?: number;
}
