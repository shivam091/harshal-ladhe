// Shared by every filterable list so toggling a chip feels the same on archives, tags, and categories.

// Enter/exit keyframes for a row appearing or disappearing as a filter changes.
export const FILTER_ITEM_VARIANTS = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 }
};

// Shares the site's disclosure easing curve, snappier to suit list reflow.
export const FILTER_ITEM_TRANSITION = { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const };

// Instant, no-motion fallback once prefers-reduced-motion is on.
export const NO_MOTION_TRANSITION = { duration: 0 };
