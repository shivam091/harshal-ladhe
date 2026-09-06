// The kind of state a timeline segment represents — drives its fill/stroke color in the helper.
export type ISRSegmentKind = "fresh" | "stale" | "rebuilding" | "idle";

// One colored segment along a row's track, spanning from x1 to x2.
export interface ISRSegment {
  x1: number;
  x2: number;
  kind: ISRSegmentKind;
  label: string;
}

// A labeled instant in time — rendered as a dashed guide line plus a short caption underneath it.
export interface ISRMarker {
  x: number;
  caption: string;
}

// Conceptual (not-to-scale) x positions shared by both rows and every marker.
export const TIMELINE_X0 = 40;
export const T_EXPIRE = 250;
export const T_REQUEST_A = 340;
export const T_REBUILD_DONE = 480;
export const T_REQUEST_B = 590;
export const TIMELINE_X_END = 640;

export const ROW_A_Y = 92;
export const ROW_B_Y = 196;
export const ROW_H = 34;

/*
  Row A — "What a visitor is served": the page reads as fresh until the revalidate window elapses,
  then reads as stale (but is STILL handed out instantly — nobody ever waits on a rebuild) for as
  long as it takes a request to actually arrive and the rebuild it triggers to finish, then flips
  back to fresh. Note this row never shows a gap or a "loading" state — every point on it is a
  request getting an immediate response, which is the entire point of stale-while-revalidate.
*/
export const CACHE_SEGMENTS: ISRSegment[] = [
  { x1: TIMELINE_X0, x2: T_EXPIRE, kind: "fresh", label: "v1 · fresh" },
  { x1: T_EXPIRE, x2: T_REBUILD_DONE, kind: "stale", label: "v1 · stale (still served instantly)" },
  { x1: T_REBUILD_DONE, x2: TIMELINE_X_END, kind: "fresh", label: "v2 · fresh" }
];

/*
  Row B — "Background regeneration": idle from build until Request A specifically triggers it (the
  window elapsing on its own does nothing — regeneration only ever starts because a request showed
  up), rebuilds for a while, then goes idle again once v2 is cached.
*/
export const REBUILD_SEGMENTS: ISRSegment[] = [
  { x1: TIMELINE_X0, x2: T_REQUEST_A, kind: "idle", label: "idle — no rebuild running" },
  { x1: T_REQUEST_A, x2: T_REBUILD_DONE, kind: "rebuilding", label: "rebuilding v2…" },
  { x1: T_REBUILD_DONE, x2: TIMELINE_X_END, kind: "idle", label: "idle — v2 now cached" }
];

// The four instants worth calling out explicitly, each with a short caption under its guide line.
export const MARKERS: ISRMarker[] = [
  { x: T_EXPIRE, caption: "window elapses" },
  { x: T_REQUEST_A, caption: "Request A arrives" },
  { x: T_REBUILD_DONE, caption: "rebuild finishes" },
  { x: T_REQUEST_B, caption: "Request B arrives" }
];
