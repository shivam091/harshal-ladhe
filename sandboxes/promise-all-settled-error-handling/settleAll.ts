export interface SettledSummary<T> {
  fulfilled: T[];
  rejected: unknown[];
}

// Runs every promise via Promise.allSettled and partitions the results into fulfilled values and
// rejection reasons — turns the { status, value|reason } union into two plain arrays.
export async function runAllSettled<T>(promises: Promise<T>[]): Promise<SettledSummary<T>> {
  const results = await Promise.allSettled(promises);

  const fulfilled: T[] = [];
  const rejected: unknown[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") fulfilled.push(result.value);
    else rejected.push(result.reason);
  }

  return { fulfilled, rejected };
}
