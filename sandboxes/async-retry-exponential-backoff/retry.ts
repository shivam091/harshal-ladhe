import type { RetryOptions } from "./types";

// Retries an async function with exponential backoff, doubling the delay each time (capped at maxDelay).
export async function retry<T>(fn: () => Promise<T>, { retries = 3, delay = 1000, maxDelay = 30000 }: RetryOptions = {}): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (retries === 0) throw e;

    console.warn(`Retrying... attempts left: ${retries}. Waiting ${delay}ms.`);

    await new Promise((resolve) => setTimeout(resolve, delay));

    const nextDelay = Math.min(delay * 2, maxDelay);

    return retry(fn, { retries: retries - 1, delay: nextDelay, maxDelay });
  }
}

// Simulated flaky endpoint — fails on its first `failCount` calls, then succeeds.
export function createFlakyCall(failCount: number) {
  let attempts = 0;
  return async () => {
    attempts += 1;
    console.log(`Attempt ${attempts}...`);
    if (attempts <= failCount) throw new Error("Server Busy");
    return { data: "Success!" };
  };
}
