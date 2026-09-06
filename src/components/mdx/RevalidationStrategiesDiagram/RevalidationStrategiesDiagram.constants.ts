// One colored segment along a lane's track.
export interface RevalidationSegment {
  x1: number;
  x2: number;
  kind: "static" | "stale" | "dynamic";
  label: string;
}

// A labeled instant along a lane. "passive" means nothing actually happens on its own (a clock
// threshold being crossed); "trigger" means this instant is what actually starts a rebuild.
export interface RevalidationMarker {
  x: number;
  caption: string;
  kind: "passive" | "trigger";
}

export const TRACK_X0 = 40;
export const TRACK_X_END = 640;
export const LANE_H = 34;

export const TIME_BASED_Y = 84;
export const ON_DEMAND_Y = 232;

export const TIME_BASED_BUILD = { x: TRACK_X0, width: 50 };
export const ON_DEMAND_BUILD = { x: TRACK_X0, width: 50 };

/*
  Time-based: fresh, then stale the moment the window elapses (a passive threshold — nothing
  regenerates yet), staying stale for an arbitrarily long, unpredictable stretch until a request
  happens to arrive, which is the actual trigger for the rebuild.
*/
export const TIME_BASED_SEGMENTS: RevalidationSegment[] = [
  { x1: 110, x2: 300, kind: "static", label: "v1 · fresh" },
  { x1: 300, x2: 460, kind: "stale", label: "v1 · stale (waiting for a request)" },
  { x1: 460, x2: 540, kind: "dynamic", label: "rebuilding" },
  { x1: 540, x2: TRACK_X_END, kind: "static", label: "v2 · fresh" }
];

export const TIME_BASED_MARKERS: RevalidationMarker[] = [
  { x: 300, caption: "window elapses", kind: "passive" },
  { x: 460, caption: "request arrives", kind: "trigger" }
];

/*
  On-demand: fresh for as long as nothing has changed — there's no fixed expiry at all — until a
  webhook (an editor hitting "publish" in a CMS) calls revalidatePath()/revalidateTag() directly.
  That call itself is the trigger: the rebuild starts immediately, with no stale window in between
  and no dependency on a visitor's request ever showing up.
*/
export const ON_DEMAND_SEGMENTS: RevalidationSegment[] = [
  { x1: 110, x2: 400, kind: "static", label: "v1 · fresh (no fixed expiry)" },
  { x1: 400, x2: 480, kind: "dynamic", label: "rebuilding" },
  { x1: 480, x2: TRACK_X_END, kind: "static", label: "v2 · fresh" }
];

export const ON_DEMAND_MARKERS: RevalidationMarker[] = [
  { x: 400, caption: "CMS publish → revalidateTag()", kind: "trigger" }
];
