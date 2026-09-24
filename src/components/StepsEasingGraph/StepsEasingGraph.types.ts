import type { StepsEasingName } from "@/constants/steps-easing-curves";

// Kept to a name and size so every plot of the same example looks identical.
export interface StepsEasingGraphProps {
  // Registry key rather than raw parameters, so each example's numbers and label live in one place.
  name: StepsEasingName;
  // Plot width/height in pixels (square). Defaults to 200.
  size?: number;
}
