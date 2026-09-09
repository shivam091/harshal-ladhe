type Listener = () => void;

// A plain external store — module-level state React doesn't own or know about at all, with the
// minimal subscribe/getSnapshot shape useSyncExternalStore expects from ANY outside data source.
let count = 0;
const listeners = new Set<Listener>();

// Registers a re-render callback and returns the unsubscribe function — the exact shape
// useSyncExternalStore's first argument requires.
export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// The current value, read synchronously — no React state involved in producing it.
export function getSnapshot(): number {
  return count;
}

// Mutates the store from OUTSIDE React entirely, then notifies every subscribed component —
// standing in for whatever real external source (a WebSocket message, a browser API event, a
// module shared across an app) would trigger this the same way.
export function increment(): void {
  count += 1;
  listeners.forEach((listener) => listener());
}
