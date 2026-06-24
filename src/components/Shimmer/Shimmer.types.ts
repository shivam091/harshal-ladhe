// A counter prop keeps the parent in control of when sweeps fire without Shimmer exposing an imperative API.
export interface ShimmerProps {
  // Must only increase — each value becomes a React key, so a repeat would collide with a live sweep.
  trigger: number;
}
