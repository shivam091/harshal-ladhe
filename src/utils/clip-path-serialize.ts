import type { ClipPathShareableState } from "@/interfaces/clip-path";

/*
  Plain JSON → base64 → URL-safe character swap. No compression dependency exists in this project
  (checked package.json) and no existing helper covers this in utils/string.ts — a shape's payload
  (a dozen-ish vertices/handles) is small enough that plain base64 is fine for v1; flag payload size
  as a v2 compression concern only if a real shape ever makes the URL unwieldy, not upfront.
*/
export function encodeShareableState(state: ClipPathShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default shape instead of crashing the page.
export function decodeShareableState(encoded: string): ClipPathShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as ClipPathShareableState;
  } catch {
    return null;
  }
}
