import type { ShaderPlaygroundShareableState } from "@/components/ShaderPlayground/ShaderPlayground.types";

// Plain JSON → base64 → URL-safe character swap. Mirrors every other goodie's own serialize util exactly.
export function encodeShareableState(state: ShaderPlaygroundShareableState): string {
  const json = JSON.stringify(state);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Reverses encodeShareableState; returns null (rather than throwing) on any malformed/tampered `?state=` value — and on anything missing a string source — so callers fall back to the default shader instead of crashing the page.
export function decodeShareableState(encoded: string): ShaderPlaygroundShareableState | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(json) as Partial<ShaderPlaygroundShareableState>;
    if (typeof parsed.source !== "string") return null;
    const uniformValues = parsed.uniformValues && typeof parsed.uniformValues === "object" ? parsed.uniformValues : {};
    return { source: parsed.source, uniformValues };
  } catch {
    return null;
  }
}
