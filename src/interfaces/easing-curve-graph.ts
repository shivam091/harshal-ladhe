import type { EasingCurveName } from "@/types/bezier";

// Props for EasingCurveGraph — the static labeled bezier plot shown next to each named curve.
export interface EasingCurveGraphProps {
  // Which curve to plot, looked up from the shared EASING_CURVES registry.
  name: EasingCurveName;
  // Plot width/height in pixels (square). Defaults to 200.
  size?: number;
}
