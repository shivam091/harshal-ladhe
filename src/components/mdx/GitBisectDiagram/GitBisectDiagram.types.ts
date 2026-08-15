// Every state a commit can be in during one bisect round — known, under test, ruled out, or the answer.
export type GitBisectCommitState = "unknown" | "good" | "bad" | "testing" | "muted" | "answer";

// One round of the search — every commit's state at that point, plus what the test found.
export interface GitBisectRow {
  // One state per commit, left to right.
  states: GitBisectCommitState[];
  // Caption describing this round's test result.
  caption: string;
}

// A commit dot's look — opacity included, so commits outside the search range can fade out.
export interface GitBisectDotStyle {
  // Fill colour token for the dot's circle.
  fill: string;
  // Stroke colour token for the dot's circle border.
  stroke: string;
  // Opacity applied to the whole dot — reduced for commits outside the current search range.
  opacity: number;
}
