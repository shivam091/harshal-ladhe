import { toISODate } from "@/utils/festive-occasions";

const DISMISS_KEY_PREFIX = "festive-banner-dismissed";

// Scoped to the local calendar day so a dismissal expires at 23:59 and the next festival day shows again.
function dismissKey(occasionId: string, now: Date): string {
  return `${DISMISS_KEY_PREFIX}:${occasionId}:${toISODate(now)}`;
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

// Marks an occasion as dismissed, pruning expired dismissals so old days don't pile up in storage.
export function dismissFestiveBanner(occasionId: string, now: Date): void {
  try {
    const key = dismissKey(occasionId, now);
    const today = toISODate(now);

    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const existing = window.localStorage.key(i);
      if (existing?.startsWith(`${DISMISS_KEY_PREFIX}:`) && !existing.endsWith(`:${today}`)) {
        window.localStorage.removeItem(existing);
      }
    }

    window.localStorage.setItem(key, "true");
  } catch {
    // Ignore write failures.
  }
}
