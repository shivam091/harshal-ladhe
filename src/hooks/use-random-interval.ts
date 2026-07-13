"use client";

import { useCallback, useEffect, useRef } from "react";
import { random } from "@/utils/random";

/*
  Like useInterval, but re-rolls a random delay within [minDelay, maxDelay) after every
  firing instead of repeating a fixed one — this is what makes Sparkles feel organic rather
  than metronomic. Pass either bound as null to pause. Returns a `cancel` callback so a caller
  can stop the ticking early, independent of the minDelay/maxDelay props.
*/
export function useRandomInterval(
  callback: () => void,
  minDelay: number | null,
  maxDelay: number | null
): () => void {
  const savedCallback = useRef(callback);
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const isEnabled = typeof minDelay === "number" && typeof maxDelay === "number";
    if (!isEnabled) return;

    const tick = () => {
      // TS can't narrow these across the closure, even though `isEnabled` already confirmed it above.
      if (typeof minDelay !== "number" || typeof maxDelay !== "number") return;

      const delay = random(minDelay, maxDelay);
      timeoutId.current = window.setTimeout(() => {
        savedCallback.current();
        tick();
      }, delay);
    };

    tick();

    return () => {
      if (timeoutId.current !== null) window.clearTimeout(timeoutId.current);
    };
  }, [minDelay, maxDelay]);

  const cancel = useCallback(() => {
    if (timeoutId.current !== null) window.clearTimeout(timeoutId.current);
  }, []);

  return cancel;
}
