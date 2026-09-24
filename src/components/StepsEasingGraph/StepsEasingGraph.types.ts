import type { StepsEasingName } from "@/constants/steps-easing-curves";

// Props for StepsEasingGraph.
export interface StepsEasingGraphProps {
  // Registry key rather than raw parameters, so each example's numbers and label live in one place.
  name: StepsEasingName;
  // Plot width/height in pixels (square). Defaults to 200.
  size?: number;
}
