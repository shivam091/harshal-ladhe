import type { EventLoopShareableState } from "@/components/EventLoopVisualiser/EventLoopVisualiser.types";

// Plain JSON → base64 → URL-safe character swap. Mirrors every other goodie's own serialize util exactly.
export function encodeShareableState(state: EventLoopShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed `?state=` value. The parsed shape is still untrusted — callers run it through sanitizeProgram before use.
export function decodeShareableState(encoded: string): unknown {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}
