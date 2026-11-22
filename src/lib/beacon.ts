/*
  Prefers sendBeacon so the request survives navigation and unload, falling back to a keepalive fetch; never throws,
  because tracking must not get in the way of what the reader is doing.
*/
export function postBeacon(url: string, payload: unknown): void {
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Dropping a count is better than breaking the page.
  }
}
