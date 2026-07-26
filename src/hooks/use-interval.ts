"use client";

import { useEffect, useRef } from "react";

/*
  Declarative setInterval — pass `delay: null` to pause. Saves the latest callback in a ref
  so the interval itself never needs to be torn down and restarted just because the callback
  identity changed, only when `delay` does. Used by the search box's melt-away clear animation,
  which needs to keep re-deriving its own interval length as the input value shrinks.
*/
export default function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = window.setInterval(() => savedCallback.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}

export { useInterval };
