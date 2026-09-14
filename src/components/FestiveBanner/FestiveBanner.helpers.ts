import type { FestiveOccasion } from "@/constants/festive-occasions";
import { getActiveRangeEndDate, toISODate } from "@/utils/festive-occasions";

// Namespaced so pruning can never touch another feature's localStorage entries.
const DISMISS_KEY_PREFIX = "festive-banner-dismissed";

// One key per occasion, so dismissing again replaces the entry instead of piling up keys.
function dismissKey(occasionId: string): string {
  return `${DISMISS_KEY_PREFIX}:${occasionId}`;
}

// A close should hold for the rest of that festival and no longer; stale entries are dropped so storage stays tidy.
export function isFestiveBannerDismissed(occasion: FestiveOccasion, now: Date): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = dismissKey(occasion.id);
    const dismissedUntil = window.localStorage.getItem(key);
    if (!dismissedUntil) return false;

    // ISO dates sort lexically, so a plain string comparison is safe.
    if (dismissedUntil >= toISODate(now)) return true;

    window.localStorage.removeItem(key);
    return false;
  } catch {
    return false;
  }
}

/*
  Lasts until the festival ends, not just today, so a multi-day festival doesn't reappear every morning. Pruning
  happens here because some keys are never read again — occasions with no upcoming dates, and the retired
  per-day key format — and would otherwise stay in storage forever.
*/
export function dismissFestiveBanner(occasion: FestiveOccasion, now: Date): void {
  const endDate = getActiveRangeEndDate(occasion, now);
  if (!endDate) return;
  try {
    const today = toISODate(now);

    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const existing = window.localStorage.key(i);
      if (!existing?.startsWith(`${DISMISS_KEY_PREFIX}:`)) continue;

      const isLegacyFormat = existing.split(":").length > 2;
      const hasEnded = (window.localStorage.getItem(existing) ?? "") < today;
      if (isLegacyFormat || hasEnded) window.localStorage.removeItem(existing);
    }

    window.localStorage.setItem(dismissKey(occasion.id), endDate);
  } catch {
    // Storage can be full or blocked (e.g. private browsing); the banner still closes for this visit.
  }
}

// Closing one banner shouldn't hide the other festivals that fall on the same day.
export function pickUndismissedOccasion(activeOccasions: FestiveOccasion[], now: Date): FestiveOccasion | null {
  return activeOccasions.find((occasion) => !isFestiveBannerDismissed(occasion, now)) ?? null;
}
