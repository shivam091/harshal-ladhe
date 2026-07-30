"use client";

import { useState, useEffect } from "react";

// Returns whether `query` currently matches, staying in sync as the viewport changes; false on the server (SSR-safe lazy init).
export function useMediaQuery(query: string): boolean {
  // Lazy initializer reads the real match on the client; returns false during SSR where window is absent.
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
