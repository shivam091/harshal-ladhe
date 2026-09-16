import type { BorderRadiusShareableState } from "@/interfaces/border-radius";

// Plain JSON → base64 → URL-safe character swap. Mirrors clip-path-serialize.ts, gradient-serialize.ts, and box-shadow-serialize.ts exactly.
export function encodeShareableState(state: BorderRadiusShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default shape instead of crashing the page.
export function decodeShareableState(encoded: string): BorderRadiusShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as BorderRadiusShareableState;
  } catch {
    return null;
  }
}
