import type { StepsEasingName } from "@/types/steps-easing";

// Props for StepsEasingGraph — the static labeled staircase plot for a named steps() example.
export interface StepsEasingGraphProps {
  // Which example to plot, looked up from the shared STEPS_EASING_CURVES registry.
  name: StepsEasingName;
  // Plot width/height in pixels (square). Defaults to 200.
  size?: number;
}
