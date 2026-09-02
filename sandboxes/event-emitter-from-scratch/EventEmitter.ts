type Listener<Args extends unknown[]> = (...args: Args) => void;

// Minimal typed pub/sub implementation. `Events` maps event names to the argument tuple their
// listeners receive, so .on/.emit stay type-checked against each event's payload shape.
export class EventEmitter<Events extends Record<string, unknown[]>> {
  private listeners: { [K in keyof Events]?: Set<Listener<Events[K]>> } = {};

  // Subscribes `listener` to `event`. Returns an unsubscribe function.
  on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    const set = this.listeners[event] ?? new Set();
    set.add(listener);
    this.listeners[event] = set;
    return () => this.off(event, listener);
  }

  // Subscribes `listener` to `event` for exactly one emission, then auto-unsubscribes.
  once<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
    const wrapped: Listener<Events[K]> = (...args) => {
      this.off(event, wrapped);
      listener(...args);
    };
    return this.on(event, wrapped);
  }

  // Removes a specific listener from `event`.
  off<K extends keyof Events>(event: K, listener: Listener<Events[K]>): void {
    this.listeners[event]?.delete(listener);
  }

  // Calls every listener subscribed to `event` with the given arguments, in subscription order.
  emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
    // Snapshot to an array first so a listener that unsubscribes mid-emit doesn't skip a sibling.
    for (const listener of Array.from(this.listeners[event] ?? [])) {
      listener(...args);
    }
  }
}
