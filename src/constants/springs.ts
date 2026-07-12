// Shared presets so motion feels consistent site-wide instead of each component tuning its own numbers.
export const SPRINGS = {
  // Smooth, balanced spring — matches react-spring's built-in default exactly.
  default: {
    tension: 170,
    friction: 26
  },
  // Low damping for a playful overshoot that draws the eye to small hover reactions.
  springy: {
    tension: 300,
    friction: 10
  },
  // Near-instant snap for interactions that should feel responsive rather than playful.
  tight: {
    tension: 450,
    friction: 25
  },
  // Quick but well-damped so shape morphs settle cleanly instead of wobbling.
  quick: {
    tension: 300,
    friction: 20
  }
};
