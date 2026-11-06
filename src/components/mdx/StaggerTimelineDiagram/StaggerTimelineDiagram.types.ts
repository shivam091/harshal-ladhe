// One panel of the diagram: a whole batch of cards staggered by one delay formula.
export interface StaggerPanel {
  // Panel heading naming the delay formula, e.g. "calc(var(--index) * 50ms)".
  heading: string;
  // Caps the index before multiplying, mirroring min(var(--index), cap); null for the uncapped formula.
  cap: number | null;
  // y coordinate of the panel's first bar.
  y: number;
  // Callout printed at the last card's bar, naming when it finally starts.
  callout: string;
  // Which side of the last bar the callout sits on, so it never runs off the axis.
  calloutSide: "before" | "after";
}
