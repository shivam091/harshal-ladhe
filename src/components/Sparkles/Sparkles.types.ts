// Computes the inline position/stacking style for one sparkle, given its size.
export type GeneratePosition = (size: number) => React.CSSProperties;

// Created per tick and pruned after its lifespan, so each sparkle's look stays fixed for its whole life.
export interface SparkleType {
  // Unique per-sparkle React key, from generateId().
  id: string;
  // Fill colour, sampled from the `colors` prop.
  color: string;
  // Rendered width/height in px, randomized within [minSize, maxSize].
  size: number;
  // Date.now() at spawn — used to prune sparkles once their lifespan elapses.
  createdAt: number;
  // Inline position/z-index for this sparkle, from `generatePosition`.
  style: React.CSSProperties;
}

// Props for the Sparkles wrapper.
export interface SparklesProps extends React.HTMLAttributes<HTMLButtonElement> {
  // How often (ms, midpoint) a new sparkle spawns.
  rate?: number;
  // Random spread (ms) applied around `rate` so spawns don't feel metronomic.
  variance?: number;
  // Smallest a sparkle can render, in px. Default: `10`
  minSize?: number;
  // Largest a sparkle can render, in px. Default: `20`
  maxSize?: number;
  // Palette to sample each sparkle's fill colour from. Default: `["#FFC700"]`
  colors?: Array<string>;
  // Content the sparkles surround.
  children: React.ReactNode;
  // Renders as a clickable <button> that toggles sparkles on/off (with a switch sound) instead
  // of an inert <span>.
  isToggleable?: boolean;
  // Inline styles applied to the outer wrapper.
  style?: React.CSSProperties;
  // Computes each sparkle's position/stacking style. Default: `defaultGeneratePosition`.
  generatePosition?: GeneratePosition;
  // Delays the first sparkle spawn by this many ms — useful to let an entrance animation settle first.
  delayBy?: number;
}
