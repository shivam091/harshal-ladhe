// Spring used while stretching upward — more friction, so it eases into the stretch rather than overshooting.
export const STRETCH_SPRING_CONFIG = {
  tension: 300,
  friction: 22
};

// Spring used while relaxing back down — less friction, so it settles with a little bounce.
export const RELAX_SPRING_CONFIG = {
  tension: 300,
  friction: 12
};

// How long the arms "flail" outward right after a stretch/relax transition starts, before settling to their resting spread.
export const FLAIL_DURATION_MS = 100;
