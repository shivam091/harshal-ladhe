import type { HTMLAttributes } from "react";

// Speed is a 1–10 scale rather than raw milliseconds so callers pick a feel, not a number.
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: number;
  // Bounded so no caller can pick a spin too sluggish or too frantic to read as loading.
  speed?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  color?: string;
}
