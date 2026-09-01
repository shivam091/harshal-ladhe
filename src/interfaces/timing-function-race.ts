import type { EasingCurveName } from "@/types/bezier";

// Props for TimingFunctionRace — the play/scrub demo that races a marker across a track using a selectable easing curve.
export interface TimingFunctionRaceProps {
  // Curves offered in the picker, in display order.
  names: EasingCurveName[];
  // Curve selected on first render. Defaults to names[0].
  initialName?: EasingCurveName;
}
