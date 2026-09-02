export interface MemoizeOptions<Args extends unknown[]> {
  // Turns the call arguments into a single cache key. Defaults to JSON.stringify(args).
  resolver?: (...args: Args) => string;
  // Maximum number of cached entries — the least-recently-used entry is evicted once exceeded.
  maxSize?: number;
  // Entries older than this many milliseconds are treated as a miss and recomputed.
  ttlMs?: number;
}

interface CacheEntry<R> {
  value: R;
  cachedAt: number;
}

// Wraps `fn` so repeated calls with the same arguments return a cached result instead of
// recomputing. Supports a custom key resolver, an LRU-style size cap, and TTL-based expiry.
export function memoize<Args extends unknown[], R>(fn: (...args: Args) => R, options: MemoizeOptions<Args> = {}) {
  const resolver = options.resolver ?? ((...args: Args) => JSON.stringify(args));
  const { maxSize, ttlMs } = options;
  const cache = new Map<string, CacheEntry<R>>();

  function memoized(...args: Args): R {
    const key = resolver(...args);
    const cached = cache.get(key);

    if (cached && (!ttlMs || Date.now() - cached.cachedAt < ttlMs)) {
      // Re-insert to move this key to the "most recently used" end of the Map's iteration order.
      cache.delete(key);
      cache.set(key, cached);
      return cached.value;
    }

    const value = fn(...args);
    cache.set(key, { value, cachedAt: Date.now() });

    if (maxSize && cache.size > maxSize) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) cache.delete(oldestKey);
    }

    return value;
  }

  // Clears every cached entry.
  memoized.clear = () => cache.clear();
  // Number of entries currently cached.
  memoized.size = () => cache.size;

  return memoized;
}
