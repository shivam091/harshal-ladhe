"use client";

import { useState, useEffect } from "react";

/*
  Null until mounted because the server can't know the input device; callers can wait on it
  instead of guessing and flashing the wrong UI during hydration.
*/
export function useHoverDevice(): boolean | null {
  const [isHoverDevice, setIsHoverDevice] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setIsHoverDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isHoverDevice;
}
