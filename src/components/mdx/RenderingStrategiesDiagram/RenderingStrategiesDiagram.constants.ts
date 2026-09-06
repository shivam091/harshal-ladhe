// One colored rect along a lane's track (a build node, a generated-on-request box, or a cached segment).
export interface StrategyBox {
  x: number;
  width: number;
  kind: "static" | "dynamic" | "stale";
  label: string;
}

export const LANE_LABEL_X = 20;
export const TRACK_X0 = 150;
export const TRACK_X_END = 600;
export const LANE_H = 34;

export const SSG_Y = 74;
export const SSR_Y = 178;
export const ISR_Y = 282;

// SSG: one build node, then a dashed line with plain request markers — every request downstream of
// the build gets the exact same HTML; nothing here ever changes until a brand new full deploy.
export const SSG_BUILD: StrategyBox = { x: TRACK_X0, width: 56, kind: "static", label: "build" };
export const SSG_REQUEST_X: number[] = [300, 380, 460, 540];

// SSR: no build node at all — every request independently triggers its own render, right on the
// track, with no shared state carried between them.
export const SSR_RENDER_X: number[] = [200, 330, 460, 570];
export const SSR_RENDER_W = 66;

/*
  ISR: a build node followed by four segments — fresh (green, served from cache), stale (amber,
  still served instantly once the revalidate window elapses), regenerating (blue, a background
  rebuild in flight), fresh again (green, v2 now cached). This is the same shape the dedicated ISR
  timeline diagram above walks through in full; here it's compressed into one lane so it can sit
  side by side with SSG and SSR.
*/
export const ISR_BUILD: StrategyBox = { x: TRACK_X0, width: 46, kind: "static", label: "build" };
export const ISR_SEGMENTS: StrategyBox[] = [
  { x: 200, width: 150, kind: "static", label: "v1 · fresh" },
  { x: 350, width: 80, kind: "stale", label: "v1 · stale" },
  { x: 430, width: 80, kind: "dynamic", label: "rebuilding" },
  { x: 510, width: 90, kind: "static", label: "v2 · fresh" }
];
