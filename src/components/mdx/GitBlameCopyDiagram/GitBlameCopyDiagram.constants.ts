import type { GitBlameStep } from "@/components/mdx/GitBlameCopyDiagram/GitBlameCopyDiagram.types";

// Radius of every commit node circle.
export const NODE_R = 9;

// x coordinate of the src/auth.js lane.
export const AUTH_X = 70;

// x coordinate of the src/login.js lane.
export const LOGIN_X = 190;

// x coordinate the right-hand commit descriptions start from.
export const LABEL_X = 236;

// y coordinate of the lane headings.
export const HEADING_Y = 26;

// y coordinate where both lanes' guide lines end.
export const LANE_END_Y = 236;

// The post's example function body, oldest first: written in auth.js, moved to login.js, then re-indented.
export const BLAME_STEPS: GitBlameStep[] = [
  { x: AUTH_X, y: 70, sha: "ad8066f", summary: "writes login()", stopLabel: "git blame -w -C stops here", emphasis: true },
  { x: LOGIN_X, y: 140, sha: "f77d8e7", summary: "moves it to login.js", stopLabel: "git blame -w stops here", emphasis: false },
  { x: LOGIN_X, y: 210, sha: "bc03c37", summary: "re-indents it", stopLabel: "git blame stops here", emphasis: false }
];
