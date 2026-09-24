import { useSyncExternalStore } from "react";

// Inverted query so browsers without support default to reduced motion — the safer assumption.
const QUERY = "(prefers-reduced-motion: no-preference)";

// The setting can be toggled mid-session, so keep listening for as long as anything reads it.
function subscribe(onChange: () => void): () => void {
  const mediaQueryList = window.matchMedia(QUERY);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

// Read fresh on every check so a mid-session change is never missed.
function getSnapshot(): boolean {
  return !window.matchMedia(QUERY).matches;
}

/*
  The server can't know the preference, so it renders as "no preference". React then hydrates
  with this same value and re-renders with the real one, rather than hydrating straight into a
  mismatch it won't patch — which left reduced-motion guards like `disabled` silently unapplied.
*/
function getServerSnapshot(): boolean {
  return false;
}

// Lets JS-driven animations honour the reduced-motion setting that CSS media queries can't reach.
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
