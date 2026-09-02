// Debounces `fn`: waits for `waitMs` of silence since the last call before invoking it once, with
// the latest arguments. Preserves the caller's `this` and forwards every argument untouched.
export function debounce<This, Args extends unknown[]>(fn: (this: This, ...args: Args) => void, waitMs: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  function debounced(this: This, ...args: Args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), waitMs);
  }

  // Cancels a pending invocation without calling `fn`.
  debounced.cancel = () => clearTimeout(timeoutId);

  return debounced;
}

// Throttles `fn`: invokes it immediately on the first call, then at most once every `waitMs`
// after that. A call landing inside the cooldown window is deferred to fire once, with its
// arguments, right as the window ends ("trailing" throttle) — no call is ever silently dropped.
export function throttle<This, Args extends unknown[]>(fn: (this: This, ...args: Args) => void, waitMs: number) {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  let trailingArgs: Args | undefined;

  function throttled(this: This, ...args: Args) {
    const now = Date.now();
    const remaining = waitMs - (now - lastCallTime);

    if (remaining <= 0) {
      lastCallTime = now;
      fn.apply(this, args);
      return;
    }

    // Arrow function below inherits `this` lexically from `throttled` — no need to alias it.
    trailingArgs = args;
    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
        lastCallTime = Date.now();
        if (trailingArgs) fn.apply(this, trailingArgs);
        trailingArgs = undefined;
      }, remaining);
    }
  }

  // Cancels any pending trailing invocation.
  throttled.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = undefined;
    trailingArgs = undefined;
  };

  return throttled;
}
