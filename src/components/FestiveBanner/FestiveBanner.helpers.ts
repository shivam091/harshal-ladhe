const DISMISS_KEY_PREFIX = "festive-banner-dismissed";

// Builds the localStorage key for a dismissal.
function dismissKey(occasionId: string, now: Date): string {
  return `${DISMISS_KEY_PREFIX}:${occasionId}:${now.getFullYear()}`;
}

// Reads whether an occasion was dismissed.
export function isFestiveBannerDismissed(occasionId: string, now: Date): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(dismissKey(occasionId, now)) === "true";
  } catch {
    return false;
  }
}

// Marks an occasion as dismissed.
export function dismissFestiveBanner(occasionId: string, now: Date): void {
  try {
    window.localStorage.setItem(dismissKey(occasionId, now), "true");
  } catch {
    // Ignore write failures.
  }
}
