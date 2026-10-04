// Keys rather than stop lists, so a race can only offer curves defined in one shared place.
export interface LinearEasingRaceProps {
  // Curve keys (from LINEAR_EASING_CURVES) offered in the picker, in display order.
  names: string[];
  // Curve selected on first render. Defaults to names[0].
  initialName?: string;
}
