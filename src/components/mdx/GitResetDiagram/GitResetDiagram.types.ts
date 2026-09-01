// Whether a reset mode leaves a given area untouched or resets it to match the target commit.
export type GitResetAreaState = "kept" | "reset";

// One `git reset` mode's row: its flag and how it leaves each of the three areas (Working Directory,
// Staging Area, Repository), in that order.
export interface GitResetModeRow {
  // The flag this row illustrates, e.g. "--soft".
  label: string;
  // One state per area, in Working Directory / Staging Area / Repository order.
  states: GitResetAreaState[];
}
