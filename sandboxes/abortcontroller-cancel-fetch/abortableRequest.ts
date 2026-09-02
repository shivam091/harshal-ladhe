interface LatestRequest<T> {
  run: (task: (signal: AbortSignal) => Promise<T>) => Promise<T>;
  cancel: () => void;
}

// Ensures only the most recently started async call's result is ever used. Calling `run` again
// aborts whatever call was still in flight via AbortController, before starting the new one —
// the classic fix for "stale response overwrites a newer one" race conditions.
export function createLatestRequest<T>(): LatestRequest<T> {
  let controller: AbortController | null = null;

  function run(task: (signal: AbortSignal) => Promise<T>): Promise<T> {
    controller?.abort();
    const current = new AbortController();
    controller = current;
    return task(current.signal);
  }

  // Aborts whatever call is currently in flight without starting a new one.
  function cancel() {
    controller?.abort();
  }

  return { run, cancel };
}
