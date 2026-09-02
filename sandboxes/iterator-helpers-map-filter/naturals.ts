// One natural number pulled from the counting generator, tagged with the pull index that produced it — lets the UI show exactly how many values the generator was asked for.
export interface Pull {
  n: number;
  pullIndex: number;
}

/*
  An infinite counting generator (1, 2, 3, ...) that reports every pull through onPull. Iterator
  helpers only advance this as far as a chain actually needs — the pull count is the live proof
  that .filter().map().take() never drains it to the end.
*/
export function* countingNaturals(onPull: (pull: Pull) => void): Generator<number> {
  let n = 1;
  let pullIndex = 0;
  while (true) {
    onPull({ n, pullIndex: pullIndex++ });
    yield n++;
  }
}

// A predicate keyed by name, applied inside the live demo's .filter() step.
export const FILTERS: Record<string, (n: number) => boolean> = {
  even: (n) => n % 2 === 0,
  odd: (n) => n % 2 !== 0,
  prime: isPrime
};

// A transform keyed by name, applied inside the live demo's .map() step.
export const MAPS: Record<string, (n: number) => number> = {
  square: (n) => n * n,
  double: (n) => n * 2,
  none: (n) => n
};

// Trial division primality check — only ever called on small demo values, so simplicity beats speed here.
function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) return false;
  }
  return true;
}
