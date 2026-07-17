"use client";

import { useEffect, useRef } from "react";

/*
  Keeps the latest callback in a ref so the interval restarts only when `delay` changes, not
  on every new callback identity; `delay: null` pauses it.
*/
export default function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay === null) return;

    const id = window.setInterval(() => savedCallback.current(), delay);
    return () => window.clearInterval(id);
  }, [delay]);
}
