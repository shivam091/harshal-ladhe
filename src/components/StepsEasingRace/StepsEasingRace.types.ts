import type { StepsEasingName } from "@/constants/steps-easing-curves";

// Props for StepsEasingRace.
export interface StepsEasingRaceProps {
  // Jump-terms offered in the picker, in display order.
  names: StepsEasingName[];
  // Jump-term selected on first render. Defaults to names[0].
  initialName?: StepsEasingName;
}
