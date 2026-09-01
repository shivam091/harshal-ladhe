import type { GitBisectRow } from "@/interfaces/git-bisect-diagram";

// Radius of every commit dot.
export const DOT_R = 9;

// Horizontal spacing between adjacent commits on the timeline.
export const SPACING = 45;

// Left x coordinate of the first (oldest) commit.
export const ORIGIN_X = 30;

// x coordinate of each of the 8 commits, oldest to newest.
export const COMMIT_X = Array.from({ length: 8 }, (_, index) => ORIGIN_X + index * SPACING);

// y coordinate of each of the 3 search rounds.
export const ROW_Y = [50, 140, 230];

/*
  The 3 rounds of `git bisect`'s binary search, narrowing from "commit 1 good, commit 8 bad" down to the
  exact first-bad commit — each round tests the midpoint of the current range and halves it accordingly.
*/
export const BISECT_ROWS: GitBisectRow[] = [
  {
    states: ["good", "unknown", "unknown", "testing", "unknown", "unknown", "unknown", "bad"],
    caption: "commit 4 is bad — search narrows to 1–4"
  },
  {
    states: ["good", "unknown", "testing", "bad", "muted", "muted", "muted", "muted"],
    caption: "commit 3 is good — search narrows to 3–4"
  },
  {
    states: ["muted", "muted", "good", "answer", "muted", "muted", "muted", "muted"],
    caption: "commit 4 is the first bad commit"
  }
];
