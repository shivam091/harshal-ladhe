import type { EasingCurveName } from "@/constants/easing-curves";

// Curve names rather than control points, so races and graphs share one source of numbers.
export interface TimingFunctionRaceProps {
  // Curves offered in the picker, in display order.
  names: EasingCurveName[];
  // Curve selected on first render. Defaults to names[0].
  initialName?: EasingCurveName;
  // Races all names at once on stacked lanes instead of offering a picker. Defaults to false.
  stacked?: boolean;
}
