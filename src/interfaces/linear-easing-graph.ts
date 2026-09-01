// Props for LinearEasingGraph — the static labeled plot for a named linear() preset from LINEAR_EASING_PRESETS.
export interface LinearEasingGraphProps {
  // Preset key, looked up from LINEAR_EASING_PRESETS.
  presetKey: string;
  // Plot width/height in pixels (square). Defaults to 200, matching EasingCurveGraph.
  size?: number;
}
