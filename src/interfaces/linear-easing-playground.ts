import type { LinearEasingStop } from "@/interfaces/linear-easing";

// Props for LinearEasingPlayground — the draggable, open-stop-count linear() editor.
export interface LinearEasingPlaygroundProps {
  // Starting stops. Defaults to the bounce-and-settle example used throughout the post.
  initialStops?: LinearEasingStop[];
  // Plot width/height in pixels (square). Defaults to 260, matching CubicBezierPlayground.
  size?: number;
}
