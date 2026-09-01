import type { GitResetModeRow } from "@/interfaces/git-reset-diagram";

// Width of every area cell.
export const CELL_W = 110;

// Height of every area cell.
export const CELL_H = 50;

// Gutter between adjacent cells.
export const GAP = 10;

// Left x coordinate of each of the three area columns: Working Directory, Staging Area, Repository.
export const COL_X = [130, 130 + CELL_W + GAP, 130 + 2 * (CELL_W + GAP)];

// Top y coordinate of each of the three mode rows: --soft, --mixed, --hard.
export const ROW_Y = [55, 115, 175];

// The two-line header label for each of the three area columns, matching COL_X order.
export const AREA_HEADERS = [["Working", "Directory"], ["Staging", "Area"], ["Repository", "(HEAD)"]];

/*
  One row per `git reset` mode — which areas it leaves kept vs. resets, in Working Directory / Staging /
  Repository order. Each mode resets a strict superset of the areas the previous, gentler mode resets.
*/
export const MODE_ROWS: GitResetModeRow[] = [
  { label: "--soft", states: ["kept", "kept", "reset"] },
  { label: "--mixed (default)", states: ["kept", "reset", "reset"] },
  { label: "--hard", states: ["reset", "reset", "reset"] }
];
