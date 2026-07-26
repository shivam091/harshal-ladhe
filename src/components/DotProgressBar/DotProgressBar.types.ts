// Takes a 0–1 fraction rather than a count so any threshold can drive the dots.
export interface DotProgressBarProps {
  // Overall progress, from 0 to 1 (values above 1 are clamped per-dot, so a slight overshoot is fine).
  value: number;
  numOfDots: number;
  dotSize?: number;
  dotColor?: string;
}
