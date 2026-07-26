// Props for DotProgressBar — a row of dots that fill in one-by-one as progress climbs from 0 to 1.
export interface DotProgressBarProps {
  // Overall progress, from 0 to 1 (values above 1 are clamped per-dot, so a slight overshoot is fine).
  value: number;
  numOfDots: number;
  dotSize?: number;
  dotColor?: string;
}
