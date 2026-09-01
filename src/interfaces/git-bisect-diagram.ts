import type { GitBisectCommitState } from "@/types/git-bisect-diagram";

// One row of the bisect search: the state of every commit at that point in the search, plus a caption
// describing the test result and what happens next.
export interface GitBisectRow {
  // One state per commit, left to right.
  states: GitBisectCommitState[];
  // Caption describing this round's test result.
  caption: string;
}

// Visual style for one commit dot: its fill, stroke, and opacity (muted commits fade to show they're outside
// the current search range).
export interface GitBisectDotStyle {
  // Fill color token for the dot's circle.
  fill: string;
  // Stroke color token for the dot's circle border.
  stroke: string;
  // Opacity applied to the whole dot — reduced for commits outside the current search range.
  opacity: number;
}
