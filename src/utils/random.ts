// Takes the generator as an argument so seeded and unseeded randomness share one helper.
export function between(rand: () => number, min: number, max: number): number {
  return min + rand() * (max - min);
}

// Seeded so decorative randomness is reproducible — the same seed always yields the same sequence.
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

// Throws on empty input so the return type T is always honoured rather than silently undefined.
export function sampleOne<T>(arr: readonly T[]): T {
  if (arr.length === 0) throw new Error("sampleOne: array must not be empty");
  return arr[Math.floor(Math.random() * arr.length)];
}

// Samples with replacement so `len` can exceed the source length.
export function sample<T>(arr: readonly T[], len: number = 1): T[] {
  const output: T[] = [];

  for (let i = 0; i < len; i++) {
    output.push(sampleOne(arr));
  }

  return output;
}

// Integer output is the common case (indices, counts), so floats are opt-out.
interface RandomOptions {
  rounded?: boolean;
}

// One helper for both integer and float ranges so callers don't hand-roll Math.random arithmetic.
export const random = (
  min: number,
  max: number,
  options: RandomOptions = {}
): number => {
  const { rounded = true } = options;
  const partialVal = Math.random() * (max - min);

  return rounded ? Math.floor(partialVal) + min : partialVal + min;
};
