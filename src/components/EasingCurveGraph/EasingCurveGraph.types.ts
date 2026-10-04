import type { EasingCurveName } from "@/constants/easing-curves";

// Props for EasingCurveGraph.
export interface EasingCurveGraphProps {
  // Registry key rather than raw control points, so each curve's numbers and label live in one place.
  name: EasingCurveName;
  // Plot width/height in pixels (square). Defaults to 200.
  size?: number;
}
