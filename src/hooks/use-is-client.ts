"use client";

import { useSyncExternalStore } from "react";

function subscribe(): () => void {
  return () => {};
}

function getClientSnapshot(): boolean {
  return true;
}

function getServerSnapshot(): boolean {
  return false;
}

/*
  Whether this render is happening on the client (after hydration) rather than during SSR or the
  first client render — the useSyncExternalStore idiom for detecting "has mounted" without the
  setState-in-effect a useState+useEffect version would need (there's genuinely no external event to
  subscribe to here; the store never changes on its own — React itself re-renders once more right
  after hydration reconciles the client snapshot against the server one, which is what flips this
  from false to true). The server snapshot is always false and the client snapshot always true, so
  the first client render matches the server-rendered markup exactly and no hydration mismatch is possible.
*/
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
