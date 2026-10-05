import { sanitiseShareableState } from "@/utils/keyframes-builder";
import type { KeyframesBuilderShareableState } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Plain JSON → base64 → URL-safe character swap. Mirrors every other goodie's own serialize util exactly.
export function encodeShareableState(state: KeyframesBuilderShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/*
  Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered
  `?state=` value. Unlike most goodies it also validates the decoded shape, since these values are
  written into a live <style> tag rather than just into inline style properties.
*/
export function decodeShareableState(encoded: string): KeyframesBuilderShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    return sanitiseShareableState(JSON.parse(json));
  } catch {
    return null;
  }
}
