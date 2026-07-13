// Maps a [0, 1) generator's next value onto a float within [min, max) — works with
// Math.random or any seeded generator like mulberry32.
export function between(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}

// mulberry32 — small, fast, good-enough-for-decoration seeded PRNG. Same seed always yields the same sequence.
export function mulberry32(seed: number): () => number {
  let state = seed;
  return function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Returns a single random element; throws on an empty array so the return type T is always honoured.
export function sampleOne<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("sampleOne: array must not be empty");
  return arr[Math.floor(Math.random() * arr.length)];
}

// Returns `len` randomly sampled elements (with replacement); throws if the source array is empty.
export function sample<T>(arr: readonly T[], len: number = 1): T[] {
  const output: T[] = [];

  for (let i = 0; i < len; i++) {
    output.push(sampleOne(arr));
  }

  return output;
}

// Controls whether the result is floored to an integer (rounded) or returned as a float.
interface RandomOptions {
  rounded?: boolean;
}

// Generates a random number between min and max bounds.
export const random = (
  min: number,
  max: number,
  options: RandomOptions = {}
): number => {
  const { rounded = true } = options;
  const partialVal = Math.random() * (max - min);

  return rounded ? Math.floor(partialVal) + min : partialVal + min;
};

const ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// Short random string, decoration-only (not cryptographically unique) — good enough for React list keys.
export function generateId(length: number = 8): string {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)];
  }
  return id;
}
