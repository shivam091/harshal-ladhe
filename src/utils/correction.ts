// Only entry routes are accepted, so a crafted link can't make the form or the email echo arbitrary text.
const ENTRY_PATH = /^\/(post|snippet|tutorial|series)\/[a-z0-9\-/]+$/i;

export function isEntryPath(value: unknown): value is string {
  return typeof value === "string" && value.length <= 200 && ENTRY_PATH.test(value);
}

// Contact page pre-filled for a correction to the entry at `entryPath`.
export function getCorrectionUrl(entryPath: string): string {
  return `/contact?entry=${encodeURIComponent(entryPath)}`;
}
