// Which phase of the event loop a timeline step belongs to — drives which fill/stroke colour it renders with.
export type TimelinePhase = "sync" | "microtask" | "macrotask";

// One step box on the timeline: the number it logs under in the post's code example, its console label, and its phase.
export interface TimelineStep {
  order: string;
  label: string;
  phase: TimelinePhase;
}

// One bracket grouping a contiguous run of steps under a shared phase label.
export interface TimelineBracket {
  startIndex: number;
  endIndex: number;
  label: string;
  phase: TimelinePhase;
}
