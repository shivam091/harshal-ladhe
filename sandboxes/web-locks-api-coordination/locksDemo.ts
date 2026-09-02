// One line of the live demo's activity log.
export interface LogLine {
  id: number;
  text: string;
  kind: "request" | "acquired" | "released" | "skipped";
}

// Shared lock name every simulated "tab" below contends for — Locks are scoped per browser origin, not per caller, so this queues identically whether the requests come from one page or three real separate tabs.
export const LOCK_NAME = "demo-shared-resource";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Requests the shared lock, holds it for holdMs while "working", then releases — logging each transition.
export async function requestLock(label: string, holdMs: number, emit: (text: string, kind: LogLine["kind"]) => void): Promise<void> {
  emit(`${label} requested the lock`, "request");
  await navigator.locks.request(LOCK_NAME, async () => {
    emit(`${label} acquired the lock`, "acquired");
    await delay(holdMs);
    emit(`${label} released the lock`, "released");
  });
}

// Requests the lock with ifAvailable — never waits; the callback runs with `false` if something else already holds it.
export async function tryLockWithoutWaiting(label: string, emit: (text: string, kind: LogLine["kind"]) => void): Promise<void> {
  emit(`${label} checked the lock (non-blocking)`, "request");
  await navigator.locks.request(LOCK_NAME, { ifAvailable: true }, async (lock) => {
    if (lock === null) {
      emit(`${label} found the lock busy — skipped instead of waiting`, "skipped");
      return;
    }
    emit(`${label} found the lock free and acquired it`, "acquired");
    await delay(600);
    emit(`${label} released the lock`, "released");
  });
}
