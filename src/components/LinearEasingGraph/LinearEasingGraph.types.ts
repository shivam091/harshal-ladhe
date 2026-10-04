// Props for LinearEasingGraph.
export interface LinearEasingGraphProps {
  // Registry key rather than raw stops, so each example's numbers and label live in one place.
  presetKey: string;
  // Plot width/height in pixels (square). Defaults to 200, matching EasingCurveGraph.
  size?: number;
}
