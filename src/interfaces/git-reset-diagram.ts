import type { GitResetAreaState } from "@/types/git-reset-diagram";

// One `git reset` mode's row: its flag and how it leaves each of the three areas (Working Directory,
// Staging Area, Repository), in that order.
export interface GitResetModeRow {
  // The flag this row illustrates, e.g. "--soft".
  label: string;
  // One state per area, in Working Directory / Staging Area / Repository order.
  states: GitResetAreaState[];
}
