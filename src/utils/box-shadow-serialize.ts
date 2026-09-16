import type { BoxShadowShareableState } from "@/interfaces/box-shadow";

/*
  Plain JSON → base64 → URL-safe character swap. Mirrors regex-serialize.ts and the other goodies'
  own serializers exactly — a shadow's payload (a handful of layers plus two colors and a radius) is
  small enough that plain base64 is fine for v1.
*/
export function encodeShareableState(state: BoxShadowShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default shadow instead of crashing the page.
export function decodeShareableState(encoded: string): BoxShadowShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as BoxShadowShareableState;
  } catch {
    return null;
  }
}
