import type { LinearEasingStop } from "@/utils/linear-easing";

// Starting stops are configurable so a post can open the editor on the curve it's discussing.
export interface LinearEasingPlaygroundProps {
  // Starting stops. Defaults to the overshoot-and-settle example used throughout the post, so the readout matches code readers have just seen.
  initialStops?: LinearEasingStop[];
  // Plot width/height in pixels (square). Defaults to 260, matching CubicBezierPlayground.
  size?: number;
}
