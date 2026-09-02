import type { ColorMixShareableState } from "@/interfaces/color-mix";

// Plain JSON → base64 → URL-safe character swap. Mirrors every other goodie's own serialize util exactly.
export function encodeShareableState(state: ColorMixShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default pair instead of crashing the page.
export function decodeShareableState(encoded: string): ColorMixShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as ColorMixShareableState;
  } catch {
    return null;
  }
}
