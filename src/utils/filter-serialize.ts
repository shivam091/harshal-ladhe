import type { FilterEditorState } from "@/interfaces/filter";

// Plain JSON → base64 → URL-safe character swap. Mirrors the other goodies' own serialize utils exactly — the whole FilterEditorState round-trips as-is, since this tool has no ephemeral UI field to strip first (see FilterEditorState's own comment).
export function encodeShareableState(state: FilterEditorState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value so callers can fall back to a default filter instead of crashing the page.
export function decodeShareableState(encoded: string): FilterEditorState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return JSON.parse(json) as FilterEditorState;
  } catch {
    return null;
  }
}
