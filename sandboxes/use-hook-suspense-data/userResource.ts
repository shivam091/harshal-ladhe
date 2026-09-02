// Shape of the mock user record the demo resolves per id.
export interface User {
  id: number;
  name: string;
  role: string;
}

const MOCK_USERS: Record<number, User> = {
  1: { id: 1, name: "Ada Lovelace", role: "Mathematician" },
  2: { id: 2, name: "Grace Hopper", role: "Rear Admiral" }
};

// Cache of in-flight/resolved promises, keyed by id — created once per id, not per render, so `use()` never sees a fresh promise on re-render (which would re-suspend forever).
const cache = new Map<number, Promise<User>>();

function fetchUser(id: number): Promise<User> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_USERS[id]), 1200);
  });
}

// Returns the cached promise for `id`, creating (and caching) it on first request.
export function getUserPromise(id: number): Promise<User> {
  let promise = cache.get(id);
  if (!promise) {
    promise = fetchUser(id);
    cache.set(id, promise);
  }
  return promise;
}
