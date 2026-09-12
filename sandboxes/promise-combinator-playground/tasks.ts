import type { TaskConfig } from "./types";

// Settles after its configured delay, resolving or rejecting per shouldFail, and reports its own
// settle time back to onSettle for the live status list — it keeps running to completion on its own
// timer no matter which combinator is racing it, since a losing promise can't be cancelled.
export function runTask(config: TaskConfig, onSettle: (elapsedMs: number, failed: boolean) => void): Promise<string> {
  const startedAt = performance.now();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const elapsedMs = performance.now() - startedAt;
      onSettle(elapsedMs, config.shouldFail);
      if (config.shouldFail) reject(new Error(`${config.label} failed`));
      else resolve(`${config.label} done`);
    }, config.delayMs);
  });
}
