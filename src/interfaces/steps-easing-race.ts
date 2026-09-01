import type { StepsEasingName } from "@/types/steps-easing";

// Props for StepsEasingRace — the play/scrub demo that races a marker across a track using a selectable steps() jump-term.
export interface StepsEasingRaceProps {
  // Jump-terms offered in the picker, in display order.
  names: StepsEasingName[];
  // Jump-term selected on first render. Defaults to names[0].
  initialName?: StepsEasingName;
}
