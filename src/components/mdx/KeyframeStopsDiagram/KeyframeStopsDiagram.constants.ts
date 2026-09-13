// Left x coordinate of the horizontal timeline (the 0% stop).
export const TIMELINE_X_START = 40;
// Right x coordinate of the horizontal timeline (the 100% stop).
export const TIMELINE_X_END = 420;
// Total pixel width the 0%-100% range is spread across.
export const TIMELINE_WIDTH = TIMELINE_X_END - TIMELINE_X_START;
// Vertical position of the timeline itself.
export const TIMELINE_Y = 100;
// Radius of each keyframe-stop marker dot on the timeline.
export const DOT_RADIUS = 5;

/*
  X positions of the five keyframe stops from the `pulsing` grouped-keyframes example, evenly
  mapped along the timeline by percentage.
*/
export const STOP_0_X = TIMELINE_X_START;
export const STOP_10_X = TIMELINE_X_START + TIMELINE_WIDTH * 0.1;
export const STOP_40_X = TIMELINE_X_START + TIMELINE_WIDTH * 0.4;
export const STOP_60_X = TIMELINE_X_START + TIMELINE_WIDTH * 0.6;
export const STOP_100_X = TIMELINE_X_END;

// Y position of the "pulsed" group's bracket (10%, 40%, 60% — sharing opacity: 0.2, scale(1.05)), drawn above the timeline.
export const GROUP_PULSE_BRACKET_Y = 55;
// Y position of the "resting" group's bracket (0%, 100% — sharing opacity: 1, scale(1)), drawn below the timeline.
export const GROUP_REST_BRACKET_Y = 145;
