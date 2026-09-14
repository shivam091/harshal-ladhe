const DISMISS_KEY_PREFIX = "festive-banner-dismissed";

/*
  Scopes a dismissal to one occurrence of an occasion (id + calendar year) rather than the
  occasion forever, so dismissing this year's Diwali banner doesn't silently suppress next
  year's Diwali too.
*/
function dismissKey(occasionId: string, now: Date): string {
  return `${DISMISS_KEY_PREFIX}:${occasionId}:${now.getFullYear()}`;
}

// SSR- and private-browsing-safe read, same convention as ThemeContext/LikeButton.
export function isFestiveBannerDismissed(occasionId: string, now: Date): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(dismissKey(occasionId, now)) === "true";
  } catch {
    return false;
  }
}

export function dismissFestiveBanner(occasionId: string, now: Date): void {
  try {
    window.localStorage.setItem(dismissKey(occasionId, now), "true");
  } catch {
    // localStorage.setItem throws in iOS Safari private browsing — dismissal just won't persist.
  }
}
