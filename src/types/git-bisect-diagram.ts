// How one commit should render in a given row of the bisect search: its known/unknown status, whether it's
// being tested this round, outside the current search range, or is the final answer.
export type GitBisectCommitState = "unknown" | "good" | "bad" | "testing" | "muted" | "answer";
