// Props for CurveRace — the generic play/scrub engine shared by every timing-function race demo (cubic-bezier, linear(), steps()).
export interface CurveRaceProps<T extends string> {
  // Curve names offered in the picker, in display order.
  names: T[];
  // Curve selected on first render. Defaults to names[0].
  initialName?: T;
  // Resolves a curve name to its display label for the picker option and screen-reader text.
  getLabel: (name: T) => string;
  // Evaluates the named curve's progress at a given time ratio (0-1) — the same computation the browser performs every frame.
  solve: (name: T, t: number) => number;
}
