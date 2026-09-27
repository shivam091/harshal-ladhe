import { useEffect, type EffectCallback } from "react";

// Runs `callback` once on mount — a named alias for `useEffect(callback, [])`, for readability.
export function useOnMount(callback: EffectCallback): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally mount-only
  useEffect(callback, []);
}
