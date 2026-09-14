import { mulberry32, between } from "@/utils/random";
import { toFixed } from "@/utils/number";
import type { Star, Planet, PlanetKind } from "@/components/HeroBanner/HeroBanner.types";

// Bounds mirror the hand-placed field this replaces, so the composition reads the same.
const X_MIN = 1630;
const X_MAX = 3500;
const Y_MIN = 5;
const Y_MAX = 340;
const SIZE_MIN = 9.5;
const SIZE_MAX = 13;
const TWINKLE_DUR_MIN = 5.8;
const TWINKLE_DUR_MAX = 7.5;
const TWINKLE_BEGIN_MAX = 2;
const TWINKLE_FROM_MIN = 0.5;
const TWINKLE_FROM_MAX = 0.8;
const DRIFT_CHANCE = 0.65;
const DRIFT_DUR_MIN = 18;
const DRIFT_DUR_MAX = 60;
const DRIFT_RANGE_X = 15;
const DRIFT_RANGE_Y = 8;
/*
  Exponent >1 skews brightness toward 0 (dim) — most real stars are faint,
  with only a rare few standing out large and bright.
*/
const BRIGHTNESS_SKEW = 2.5;

/*
  Generates `count` stars from `seed`. Same seed always yields the same field (used for
  the SSR/hydration-matched first paint); a fresh seed (e.g. Date.now()) produces a
  genuinely new field, which HeroBanner uses for its post-mount re-roll.
*/
export function generateStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);

  /*
    Builds one star's full set of properties — position, size, and twinkle/drift
    animation timing — off a shared draw from the seeded PRNG stream, so the same
    seed always reproduces the exact same star at the exact same index.
  */
  const createStar = (): Star => {
    /*
      One brightness draw per star, skewed dim; size and twinkle-floor both
      scale off it so a star that's bigger also dips less when it twinkles,
      the way a bright real star reads as steadier than a faint one.
    */
    const brightness = Math.pow(rand(), BRIGHTNESS_SKEW);

    return {
      x: toFixed(between(rand, X_MIN, X_MAX), 1),
      y: toFixed(between(rand, Y_MIN, Y_MAX), 1),
      size: toFixed(SIZE_MIN + brightness * (SIZE_MAX - SIZE_MIN), 1),
      twinkleDur: toFixed(between(rand, TWINKLE_DUR_MIN, TWINKLE_DUR_MAX), 1),
      twinkleBegin: toFixed(between(rand, 0, TWINKLE_BEGIN_MAX), 1),
      twinkleFrom: toFixed(TWINKLE_FROM_MIN + brightness * (TWINKLE_FROM_MAX - TWINKLE_FROM_MIN), 2),
      drift: rand() < DRIFT_CHANCE
        ? {
            dur: toFixed(between(rand, DRIFT_DUR_MIN, DRIFT_DUR_MAX), 1),
            dx: toFixed(between(rand, -DRIFT_RANGE_X, DRIFT_RANGE_X), 1),
            dy: toFixed(between(rand, -DRIFT_RANGE_Y, DRIFT_RANGE_Y), 1)
          }
        : null
    };
  };

  return Array.from({ length: count }, createStar);
}

// Each planet symbol's natural (unscaled) render size — must match the viewBox declared on its <symbol> in HeroBanner.tsx.
const PLANET_SIZES: Record<PlanetKind, { width: number; height: number }> = {
  saturn:  { width: 140, height: 70 },
  uranus:  { width: 40,  height: 60 },
  jupiter: { width: 52,  height: 52 },
  earth:   { width: 44,  height: 44 },
  neptune: { width: 32,  height: 32 },
  venus:   { width: 30,  height: 30 },
  moon:    { width: 48,  height: 48 },
  mars:    { width: 28,  height: 28 },
  mercury: { width: 24,  height: 24 }
};
const PLANET_KINDS = Object.keys(PLANET_SIZES) as PlanetKind[];

// Same visible band the star field occupies, so planets stay within the composition's readable area.
const PLANET_X_MIN = 1650;
const PLANET_X_MAX = 3480;
const PLANET_Y_MIN = 30;
const PLANET_Y_MAX = 260;
const PLANET_SCALE_MIN = 0.7;
const PLANET_SCALE_MAX = 1.3;
const PLANET_DRIFT_DUR_MIN = 30;
const PLANET_DRIFT_DUR_MAX = 65;
const PLANET_DRIFT_RANGE = 6;

/*
  Generates `count` planets from `seed` — same reproducible-then-reroll pattern as generateStars
  (see HeroBanner.tsx). Kind order is shuffled per seed and each kind is used at most once, so the
  field never repeats a planet; `count` above PLANET_KINDS.length is clamped down to it.
*/
export function generatePlanets(count: number, seed: number): Planet[] {
  const rand = mulberry32(seed);
  const kinds = [...PLANET_KINDS];

  for (let i = kinds.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }

  const planetCount = Math.min(count, kinds.length);

  const createPlanet = (index: number): Planet => {
    const kind = kinds[index];
    const scale = between(rand, PLANET_SCALE_MIN, PLANET_SCALE_MAX);
    const { width, height } = PLANET_SIZES[kind];

    return {
      kind,
      x: toFixed(between(rand, PLANET_X_MIN, PLANET_X_MAX), 1),
      y: toFixed(between(rand, PLANET_Y_MIN, PLANET_Y_MAX), 1),
      width: toFixed(width * scale, 1),
      height: toFixed(height * scale, 1),
      drift: {
        dur: toFixed(between(rand, PLANET_DRIFT_DUR_MIN, PLANET_DRIFT_DUR_MAX), 1),
        dx: toFixed(between(rand, -PLANET_DRIFT_RANGE, PLANET_DRIFT_RANGE), 1),
        dy: toFixed(between(rand, -PLANET_DRIFT_RANGE, PLANET_DRIFT_RANGE), 1)
      }
    };
  };

  return Array.from({ length: planetCount }, (_, i) => createPlanet(i));
}
