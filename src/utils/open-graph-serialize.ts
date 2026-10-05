import type { OpenGraphShareableState } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Plain JSON → base64 → URL-safe character swap. Mirrors every other goodie's own serialize util exactly.
export function encodeShareableState(state: OpenGraphShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default field set instead of crashing the page.
export function decodeShareableState(encoded: string): OpenGraphShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(json) as Partial<OpenGraphShareableState>;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as OpenGraphShareableState;
  } catch {
    return null;
  }
}
