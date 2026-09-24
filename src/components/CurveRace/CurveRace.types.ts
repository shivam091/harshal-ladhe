// Curve-agnostic so any timing-function family can plug in by supplying its own names and solver.
export interface CurveRaceProps<T extends string> {
  // Curve names offered in the picker, in display order.
  names: T[];
  // Curve selected on first render. Defaults to names[0].
  initialName?: T;
  // Display label for the picker and screen-reader text.
  getLabel: (name: T) => string;
  // Progress at time ratio t (0-1) — mirrors what the browser computes each frame.
  solve: (name: T, t: number) => number;
}
