import type { TimelineStep, TimelineBracket, TimelinePhase } from "@/components/mdx/MicrotaskMacrotaskTimelineDiagram/MicrotaskMacrotaskTimelineDiagram.types";

// Width shared by every step box — wide enough for its console.log label.
export const STEP_W = 80;
// Height shared by every step box.
export const STEP_H = 50;
// Horizontal gap between two step boxes, leaving room for the arrow between them.
export const STEP_GAP = 14;
// Top y coordinate shared by every step box.
export const STEP_Y = 30;
// Left x coordinate of the first step box; each next box sits one STEP_W + STEP_GAP further right.
export const FIRST_STEP_X = 12;

/*
  The five console.log lines from this post's `queueMicrotask()` example, reordered left-to-right
  into the order they actually run in — not the order they appear in the source. The step numbers
  intentionally stay scrambled (1, 5, 3, 4, 2) to match the post's own numbered comments, so a
  reader can match this diagram straight back to that code block.
*/
export const STEPS: TimelineStep[] = [
  { order: "1", label: "Start", phase: "sync" },
  { order: "5", label: "End", phase: "sync" },
  { order: "3", label: "Promise", phase: "microtask" },
  { order: "4", label: "queueMicrotask", phase: "microtask" },
  { order: "2", label: "setTimeout", phase: "macrotask" }
];

// Groups of contiguous steps under one phase label, drawn as a bracket beneath the row of boxes.
export const BRACKETS: TimelineBracket[] = [
  { startIndex: 0, endIndex: 1, label: "Synchronous", phase: "sync" },
  { startIndex: 2, endIndex: 3, label: "Microtasks — drain fully", phase: "microtask" },
  { startIndex: 4, endIndex: 4, label: "Macrotask — exactly one", phase: "macrotask" }
];

// y coordinate of the horizontal bracket line beneath the step boxes.
export const BRACKET_Y = STEP_Y + STEP_H + 14;
// How far each bracket's end-ticks drop below its horizontal line.
export const BRACKET_TICK_H = 6;
// y coordinate of each bracket's label text.
export const BRACKET_LABEL_Y = BRACKET_Y + 22;

// Fill/stroke colour pair for each phase, matching the accent-means-priority convention used across this post's diagrams.
export const PHASE_COLORS: Record<TimelinePhase, { fill: string; stroke: string }> = {
  sync: { fill: "var(--color-bg-muted)", stroke: "var(--color-border-default)" },
  microtask: { fill: "var(--color-bg-accent-muted)", stroke: "var(--color-border-accent-emphasis)" },
  macrotask: { fill: "var(--color-bg-success-muted)", stroke: "var(--color-border-success-emphasis)" }
};

/*
  Legend restating each phase's colour — the brackets above already carry these same labels inline,
  but the legend keeps this diagram consistent with EventLoopDiagram, where the queue colours have
  no other in-diagram explanation.
*/
export const LEGEND: { phase: TimelinePhase; label: string }[] = [
  { phase: "sync", label: "Synchronous — runs immediately" },
  { phase: "microtask", label: "Microtask — runs first, drains completely" },
  { phase: "macrotask", label: "Macrotask — runs one, after microtasks drain" }
];

// y coordinate of the legend's first row.
export const LEGEND_Y = BRACKET_LABEL_Y + 20;
// Vertical gap between each legend row.
export const LEGEND_ROW_GAP = 18;
