// Stands in for a real fetch() — resolves after completionMs, unless the combined signal aborts first (from either the manual cancel or the timeout, whichever fires first).
export function mockTask(completionMs: number, signal: AbortSignal): Promise<string> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const timeoutId = setTimeout(() => resolve("task completed"), completionMs);

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

// Labels an AbortSignal's .reason for the log — a DOMException("TimeoutError") from AbortSignal.timeout(), a manual DOMException from the cancel button, or anything else.
export function describeAbortReason(reason: unknown): string {
  if (reason instanceof DOMException && reason.name === "TimeoutError") {
    return "timed out";
  }
  if (reason instanceof DOMException) {
    return `manually cancelled (${reason.message})`;
  }
  return `aborted (${String(reason)})`;
}
