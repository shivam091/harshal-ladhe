import type { SpringValue } from "@react-spring/web";

/*
  Face expression driving which eyes/mouth artwork is shown — 'super-happy' once a like has
  succeeded, 'sad' briefly if the cursor leaves without liking.
*/
export type Status = "slightly-happy" | "super-happy" | "sad";

// A pair of animated x/y coordinates, e.g. the eye pupils' tracked offset.
export type SpringXY = {
  // Animated horizontal offset.
  x: SpringValue<number>;
  // Animated vertical offset.
  y: SpringValue<number>;
};

// A single animated position value, e.g. the mouth curve's control-point Y.
export type SpringPosition = {
  // Animated Y coordinate of the mouth curve's control point.
  position: SpringValue<number>;
};
