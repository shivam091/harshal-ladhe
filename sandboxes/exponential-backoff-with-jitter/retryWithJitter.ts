import type { RetryOptions } from "./types";

// Retries an async function with Full Jitter — randomizes the wait between 0 and the capped
// delay instead of waiting the exact backoff value, so concurrent clients don't retry in sync.
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  { retries = 3, delay = 400, maxDelay = 4000, jitter = true, onWait, label }: RetryOptions = {}
): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (retries === 0) throw e;

    const currentRange = Math.min(delay, maxDelay);
    const wait = jitter ? Math.random() * currentRange : currentRange;
    onWait?.(wait);

    console.warn(
      `${label ? label + ": " : ""}retrying in ${Math.round(wait)}ms (jitter ${jitter ? "on" : "off"}, retries left: ${retries})`
    );

    await new Promise((resolve) => setTimeout(resolve, wait));

    return retryWithJitter(fn, { retries: retries - 1, delay: delay * 2, maxDelay, jitter, onWait, label });
  }
}

// Always fails twice, then succeeds — every simulated client hits this on the same first request.
export function createFlakyCall(label?: string) {
  let attempts = 0;
  return async () => {
    attempts += 1;
    console.log(`${label ? label + ": " : ""}attempt ${attempts}`);
    if (attempts <= 2) throw new Error("Connection Timeout");
    return { success: true };
  };
}
