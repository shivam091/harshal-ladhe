// Stands in for a real fetch() — resolves after `delayMs`, or rejects early if `signal` aborts first.
export function mockRequest(delayMs: number, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const timeoutId = setTimeout(() => resolve(`Responded after ${delayMs}ms`), delayMs);

    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timeoutId);
        reject(signal.reason);
      },
      { once: true }
    );
  });
}
