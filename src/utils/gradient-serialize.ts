import type { GradientShareableState } from "@/interfaces/gradient";

/*
  Plain JSON → base64 → URL-safe character swap, mirroring this codebase's other `?state=`
  serializers (cron-serialize.ts, regex-serialize.ts) — a gradient's payload (a handful of stops
  plus one config object) is small enough that plain base64 is fine.
*/
export function encodeShareableState(state: GradientShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default gradient instead of crashing the page.
export function decodeShareableState(encoded: string): GradientShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as GradientShareableState;
  } catch {
    return null;
  }
}
