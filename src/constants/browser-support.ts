import type { BrowserName } from "@/components/OutdatedBrowserBanner/OutdatedBrowserBanner.types";

/*
  Oldest major version of each browser that still gets no notice. Browsers ship every few weeks, so these trail
  the current stable release by a couple of versions rather than chasing it. Revisit them every few months
  (check each browser's release calendar) so "outdated" keeps meaning "a release or two behind".
*/
export const MINIMUM_BROWSER_VERSIONS: Record<BrowserName, number> = {
  chrome: 140,
  edge: 140,
  firefox: 140,
  safari: 26,
  opera: 124
};

// Where each browser's own update instructions live, so the notice sends readers to the source of truth.
export const BROWSER_UPDATE_URLS: Record<BrowserName, string> = {
  chrome: "https://support.google.com/chrome/answer/95414",
  edge: "https://support.microsoft.com/microsoft-edge/microsoft-edge-update-settings",
  firefox: "https://support.mozilla.org/kb/update-firefox-latest-release",
  safari: "https://support.apple.com/108382",
  opera: "https://help.opera.com/latest/crashes-and-issues/#updateOpera"
};

// Human-readable names for the notice copy.
export const BROWSER_LABELS: Record<BrowserName, string> = {
  chrome: "Chrome",
  edge: "Edge",
  firefox: "Firefox",
  safari: "Safari",
  opera: "Opera"
};
