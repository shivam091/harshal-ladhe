import type { HTMLAttributes } from "react";

// Props for the shared rotating-loader spinner — the site's own "loader" icon spun via CSS animation.
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number;
  // 1 (slowest, 2400ms/rotation) – 10 (fastest, 200ms/rotation); defaults to a middling 5.
  speed?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  color?: string;
}
