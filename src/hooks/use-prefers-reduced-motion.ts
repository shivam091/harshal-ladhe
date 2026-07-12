import { useState, useEffect } from "react";

// Matches when the user has NOT requested reduced motion — negated when read to get "prefersReducedMotion".
const QUERY = "(prefers-reduced-motion: no-preference)";

// Returns true when the OS/browser reduce-motion setting is on; false on server (SSR-safe lazy init).
export function usePrefersReducedMotion(): boolean {
  // Lazy initializer reads the real preference on the client; returns false during SSR where window is absent.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && !window.matchMedia(QUERY).matches
  );

  // Subscribes to system-level preference changes so the value stays in sync after mount.
  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(!event.matches);
    };

    mediaQueryList.addEventListener("change", listener);
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, []);

  return prefersReducedMotion;
}
