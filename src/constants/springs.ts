// Named React Spring configs — tension/friction presets for common animation feels (default, springy, tight).
export const SPRINGS = {
  // Smooth, balanced spring — matches react-spring's built-in default exactly.
  default: {
    tension: 170,
    friction: 26,
  },
  // Fast acceleration + low damping → elastic, bouncy overshoot. Good for boop effects.
  springy: {
    tension: 300,
    friction: 10,
  },
  // Very high tension + moderate damping → crisp, near-instant snap with minimal bounce.
  tight: {
    tension: 450,
    friction: 25,
  },
  // Fast + well-damped → a quick, clean transition with no lingering bounce. Good for icon morphs.
  quick: {
    tension: 300,
    friction: 20,
  },
  // Extremely stiff + heavily damped → tracks a fast-moving input (e.g. the cursor) with almost no lag or overshoot.
  fast: {
    tension: 1270,
    friction: 200,
  }
};
