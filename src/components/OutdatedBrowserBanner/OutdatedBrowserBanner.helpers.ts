import { MINIMUM_BROWSER_VERSIONS } from "@/constants/browser-support";
import type { DetectedBrowser } from "@/components/OutdatedBrowserBanner/OutdatedBrowserBanner.types";

// Namespaced so it can never collide with another feature's sessionStorage entry.
const DISMISS_KEY = "outdated-browser-banner-dismissed";

// Order matters: most browsers' user agents also contain "Chrome" or "Safari", so the specific tokens go first.
const BROWSER_PATTERNS: Array<{ name: DetectedBrowser["name"]; pattern: RegExp }> = [
  { name: "edge", pattern: /\b(?:Edg|EdgA|EdgiOS)\/(\d+)/ },
  { name: "opera", pattern: /\bOPR\/(\d+)/ },
  { name: "firefox", pattern: /\b(?:Firefox|FxiOS)\/(\d+)/ },
  { name: "chrome", pattern: /\b(?:Chrome|CriOS)\/(\d+)/ },
  { name: "safari", pattern: /\bVersion\/(\d+)(?:\.\d+)*.*\bSafari\// }
];

// Unrecognised browsers (in-app webviews, niche forks) return null so they're never wrongly told to update.
export function detectBrowser(userAgent: string): DetectedBrowser | null {
  // Samsung Internet and similar Chromium forks version independently of Chrome, so Chrome's cut-off doesn't apply.
  if (/SamsungBrowser|UCBrowser|YaBrowser|Vivaldi|DuckDuckGo/.test(userAgent)) return null;

  for (const { name, pattern } of BROWSER_PATTERNS) {
    const match = pattern.exec(userAgent);
    if (match) return { name, version: Number(match[1]) };
  }
  return null;
}

// A browser is outdated once its major version falls below the cut-off for its family.
export function isBrowserOutdated(browser: DetectedBrowser): boolean {
  return browser.version < MINIMUM_BROWSER_VERSIONS[browser.name];
}

// Dismissal lasts the session only, so the notice returns on the next visit until the browser is updated.
export function isOutdatedBrowserBannerDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISS_KEY) === "true";
  } catch {
    return false;
  }
}

// Storage can be blocked, in which case the notice simply hides for this page view.
export function dismissOutdatedBrowserBanner(): void {
  try {
    window.sessionStorage.setItem(DISMISS_KEY, "true");
  } catch {
    // Nothing to persist; the in-memory state still hides the notice.
  }
}
