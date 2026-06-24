// Props for the generic trigger-driven shimmer sweep overlay.
export interface ShimmerProps {
  // Monotonically increasing counter bumped by the parent on each event; every new value mounts a fresh shimmer instance.
  trigger: number;
}
