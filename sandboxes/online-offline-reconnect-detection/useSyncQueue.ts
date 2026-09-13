import { useEffect, useRef, useState } from "react";

// One update made while (possibly) offline, tracked through its send lifecycle.
export interface QueuedUpdate {
  id: string;
  label: string;
  status: "queued" | "sending" | "sent" | "failed";
}

// Simulates a flaky write to a server — resolves after a short delay, occasionally rejecting so the retry loop below actually gets exercised.
function sendUpdate(label: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => (Math.random() < 0.3 ? reject(new Error(`failed to send "${label}"`)) : resolve()), 600);
  });
}

// Queues updates locally and flushes them — one at a time, up to 3 attempts each — the moment isOnline flips from false to true.
export function useSyncQueue(isOnline: boolean) {
  const [queue, setQueue] = useState<QueuedUpdate[]>([]);
  const nextId = useRef(1);
  const flushing = useRef(false);

  // Adds a new update to the queue in the "queued" state, to be sent immediately if already online or on the next reconnect otherwise.
  function enqueue(label: string) {
    setQueue((prev) => [...prev, { id: String(nextId.current++), label, status: "queued" }]);
  }

  useEffect(() => {
    if (!isOnline || flushing.current) return;

    // Sends every still-"queued" item in order, retrying each up to 3 times before giving up on it. "sent"/"failed" are terminal — skipped on every run so a later, unrelated queue change doesn't resend or re-attempt them.
    async function flush() {
      flushing.current = true;
      // Re-reads `queue` fresh on every run of this effect — since `queue` is a dependency below, enqueuing a new item (whether online already or after a reconnect) reschedules this effect with the up-to-date array, rather than only reacting to isOnline flipping.
      for (const item of queue) {
        if (item.status === "sent" || item.status === "failed") continue;
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "sending" } : q)));

        let sent = false;
        for (let attempt = 0; attempt < 3 && !sent; attempt++) {
          try {
            await sendUpdate(item.label);
            sent = true;
          } catch {
            // retried on the next loop iteration until attempts run out
          }
        }

        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: sent ? "sent" : "failed" } : q)));
      }
      flushing.current = false;
    }

    flush();
  }, [isOnline, queue]);

  return { queue, enqueue };
}
