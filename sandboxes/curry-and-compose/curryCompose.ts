// Curries a 2-argument function: returns a function that takes the first argument and returns
// another function waiting on the second, before finally calling the original with both.
export function curry<A, B, R>(fn: (a: A, b: B) => R): (a: A) => (b: B) => R;
// Same idea for a 3-argument function.
export function curry<A, B, C, R>(fn: (a: A, b: B, c: C) => R): (a: A) => (b: B) => (c: C) => R;
export function curry(fn: (...args: unknown[]) => unknown) {
  return function curried(...args: unknown[]): unknown {
    if (args.length >= fn.length) return fn(...args);
    return (...more: unknown[]) => curried(...args, ...more);
  };
}

// Composes single-argument functions right-to-left: compose(f, g, h)(x) === f(g(h(x))).
export function compose<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduceRight((acc, fn) => fn(acc), arg);
}

// Composes single-argument functions left-to-right: pipe(f, g, h)(x) === h(g(f(x))).
export function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (arg: T) => fns.reduce((acc, fn) => fn(acc), arg);
}
