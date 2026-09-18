import type { SvgPathShareableState } from "@/interfaces/svg-path";

/*
  Plain JSON → base64 → URL-safe character swap. No compression dependency exists in this project
  (mirrors clip-path-serialize.ts) — a path's payload (a handful of vertices/handles) is small enough
  that plain base64 is fine for v1.
*/
export function encodeShareableState(state: SvgPathShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default path instead of crashing the page.
export function decodeShareableState(encoded: string): SvgPathShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as SvgPathShareableState;
  } catch {
    return null;
  }
}
