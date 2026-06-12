import { useSyncExternalStore } from "react";

// The browser fires these on window whenever connectivity changes, so they're the only signal worth listening to.
function subscribe(onChange: () => void): () => void {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

// Read fresh on every check so a change between renders is never missed.
function getSnapshot(): boolean {
  return navigator.onLine;
}

// The server can't know, and assuming online means nothing flashes an "offline" warning during hydration.
function getServerSnapshot(): boolean {
  return true;
}

// Connectivity changes outside React, so it's read as an external store to stay in step with the browser.
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
