// Props for LinearEasingRace — the play/scrub demo that races a marker across a track using a selectable linear() preset.
export interface LinearEasingRaceProps {
  // Preset keys offered in the picker, in display order.
  names: string[];
  // Preset selected on first render. Defaults to names[0].
  initialName?: string;
}
