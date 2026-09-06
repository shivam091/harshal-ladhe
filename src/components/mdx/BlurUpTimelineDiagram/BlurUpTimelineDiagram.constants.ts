import type { BlurUpLane } from "@/components/mdx/BlurUpTimelineDiagram/BlurUpTimelineDiagram.types";

// Total request time this timeline spans, and the tick marks drawn along its axis.
export const TIME_MAX_MS = 1200;
export const TIME_TICKS_MS = [0, 300, 600, 900, 1200];

// The instant, on both lanes, the real full-resolution image finishes downloading.
export const LOAD_AT_MS = 700;

// Plot area's horizontal bounds — left edge leaves room for the lane caption, right edge for margin.
export const PLOT_X0 = 180;
export const PLOT_X1 = 540;
export const PLOT_SCALE = (PLOT_X1 - PLOT_X0) / TIME_MAX_MS;

// Row/lane vertical rhythm.
export const ROW_H = 30;
export const LANE_TITLE_H = 22;
export const LANE_GAP = 34;
export const AXIS_Y = 30;
export const FIRST_LANE_Y = 58;

export const CANVAS_H = FIRST_LANE_Y + 2 * (LANE_TITLE_H + ROW_H) + LANE_GAP + 30;

/*
  The same 1200ms load, shown two ways. With placeholder="blur", the slot shows a real (if blurry)
  preview from the very first paint, then swaps to the sharp photo the instant it finishes loading —
  the user never sees an empty hole. Without a placeholder, the slot renders nothing at all until that
  same instant, then the sharp photo simply appears. Both lanes reach "sharp" at the exact same time —
  the only thing placeholder="blur" changes is what fills the wait beforehand.
*/
export const BLUR_UP_LANES: BlurUpLane[] = [
  {
    caption: "placeholder=\"blur\"",
    segments: [
      { endMs: LOAD_AT_MS, state: "preview", label: "blurred preview visible" },
      { endMs: TIME_MAX_MS, state: "sharp", label: "sharp photo visible" }
    ]
  },
  {
    caption: "no placeholder",
    segments: [
      { endMs: LOAD_AT_MS, state: "blank", label: "nothing rendered" },
      { endMs: TIME_MAX_MS, state: "sharp", label: "sharp photo visible" }
    ]
  }
];
