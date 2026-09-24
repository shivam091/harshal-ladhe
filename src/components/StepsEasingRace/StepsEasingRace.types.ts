import type { StepsEasingName } from "@/constants/steps-easing-curves";

// Names rather than raw step counts so each lane reuses the registry's labels and parameters.
export interface StepsEasingRaceProps {
  // Jump-terms offered in the picker, in display order.
  names: StepsEasingName[];
  // Jump-term selected on first render. Defaults to names[0].
  initialName?: StepsEasingName;
}
