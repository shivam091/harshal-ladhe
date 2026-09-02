import { useEffect, useState } from "react";

// Returns a copy of `value` that only updates once no new value has arrived for `delayMs` —
// use it to defer expensive work (search requests, filtering, validation) until input settles.
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);

    // Cancel the pending update if `value` changes again before the delay elapses.
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
