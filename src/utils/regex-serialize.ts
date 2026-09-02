import type { RegexTesterShareableState } from "@/interfaces/regex-tester";

// Plain JSON → base64 → URL-safe character swap. Mirrors every other goodie's own serialize util exactly.
export function encodeShareableState(state: RegexTesterShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default pattern instead of crashing the page.
export function decodeShareableState(encoded: string): RegexTesterShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as RegexTesterShareableState;
  } catch {
    return null;
  }
}
