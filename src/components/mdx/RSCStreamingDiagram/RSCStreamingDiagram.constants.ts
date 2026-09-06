import type { StreamingLane } from "@/components/mdx/RSCStreamingDiagram/RSCStreamingDiagram.types";

// Total request time this timeline spans, and the tick marks drawn along its axis.
export const TIME_MAX_MS = 1600;
export const TIME_TICKS_MS = [0, 400, 800, 1200, 1600];

// Plot area's horizontal bounds — left edge leaves room for row labels, right edge for margin.
export const PLOT_X0 = 168;
export const PLOT_X1 = 540;
export const PLOT_SCALE = (PLOT_X1 - PLOT_X0) / TIME_MAX_MS;

// Row/lane vertical rhythm.
export const ROW_H = 26;
export const ROW_GAP = 8;
export const LANE_TITLE_H = 22;
export const LANE_GAP = 30;
export const AXIS_Y = 30;
export const FIRST_LANE_Y = 58;

/*
  Same three tree segments, same total request time, compared under two strategies: "No Suspense"
  where the whole page waits for the slowest part to resolve before anything paints, and "With
  Suspense" where each part becomes visible the moment its own data is ready. This is the diagram the
  RSC/Suspense relationship hangs on — Suspense is what lets a slow Server Component's subtree stream
  in separately instead of blocking everything else.
*/
export const STREAMING_LANES: StreamingLane[] = [
  {
    caption: "No Suspense — the whole page waits for the slowest part",
    rows: [
      { label: "Shell (nav/header)", visibleAtMs: 1600, colorRole: "shell" },
      { label: "Post list", visibleAtMs: 1600, colorRole: "list" },
      { label: "Comments", visibleAtMs: 1600, colorRole: "comments" }
    ]
  },
  {
    caption: "With Suspense — each part appears the moment it resolves",
    rows: [
      { label: "Shell (nav/header)", visibleAtMs: 0, colorRole: "shell" },
      { label: "Post list", visibleAtMs: 800, colorRole: "list" },
      { label: "Comments", visibleAtMs: 1600, colorRole: "comments" }
    ]
  }
];
