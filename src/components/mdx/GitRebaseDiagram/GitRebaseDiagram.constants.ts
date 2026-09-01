import type { GitRebaseNode, GitRebaseEdge } from "@/interfaces/git-rebase-diagram";

// Radius of every commit node circle.
export const NODE_R = 10;

// y coordinate of the "main" row in the before panel.
export const BEFORE_MAIN_Y = 50;

// y coordinate of the "feature" row in the before panel.
export const BEFORE_FEATURE_Y = 96;

// y coordinate of the "main" row in the after panel.
export const AFTER_MAIN_Y = 190;

// y coordinate of the "feature" row in the after panel, now replayed after main's tip.
export const AFTER_FEATURE_Y = 236;

// Commit nodes before rebasing: main runs A-B-C, feature branches off B with its own D-E.
export const BEFORE_NODES: GitRebaseNode[] = [
  { x: 60, y: BEFORE_MAIN_Y, label: "A", emphasis: false },
  { x: 115, y: BEFORE_MAIN_Y, label: "B", emphasis: false },
  { x: 170, y: BEFORE_MAIN_Y, label: "C", emphasis: false },
  { x: 140, y: BEFORE_FEATURE_Y, label: "D", emphasis: false },
  { x: 195, y: BEFORE_FEATURE_Y, label: "E", emphasis: false }
];

// Edges before rebasing: main's line, feature's branch-off, and feature's own line.
export const BEFORE_EDGES: GitRebaseEdge[] = [
  { x1: 60, y1: BEFORE_MAIN_Y, x2: 115, y2: BEFORE_MAIN_Y },
  { x1: 115, y1: BEFORE_MAIN_Y, x2: 170, y2: BEFORE_MAIN_Y },
  { x1: 115, y1: BEFORE_MAIN_Y, x2: 140, y2: BEFORE_FEATURE_Y },
  { x1: 140, y1: BEFORE_FEATURE_Y, x2: 195, y2: BEFORE_FEATURE_Y }
];

// Commit nodes after rebasing: main is untouched, feature's commits are replayed as new D'/E' after C.
export const AFTER_NODES: GitRebaseNode[] = [
  { x: 60, y: AFTER_MAIN_Y, label: "A", emphasis: false },
  { x: 115, y: AFTER_MAIN_Y, label: "B", emphasis: false },
  { x: 170, y: AFTER_MAIN_Y, label: "C", emphasis: false },
  { x: 225, y: AFTER_FEATURE_Y, label: "D'", emphasis: true },
  { x: 280, y: AFTER_FEATURE_Y, label: "E'", emphasis: true }
];

// Edges after rebasing: main's line, the branch-off from C, and the replayed feature line.
export const AFTER_EDGES: GitRebaseEdge[] = [
  { x1: 60, y1: AFTER_MAIN_Y, x2: 115, y2: AFTER_MAIN_Y },
  { x1: 115, y1: AFTER_MAIN_Y, x2: 170, y2: AFTER_MAIN_Y },
  { x1: 170, y1: AFTER_MAIN_Y, x2: 225, y2: AFTER_FEATURE_Y },
  { x1: 225, y1: AFTER_FEATURE_Y, x2: 280, y2: AFTER_FEATURE_Y }
];
