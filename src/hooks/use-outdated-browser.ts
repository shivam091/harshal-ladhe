"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  detectBrowser,
  dismissOutdatedBrowserBanner,
  isBrowserOutdated,
  isOutdatedBrowserBannerDismissed
} from "@/components/OutdatedBrowserBanner/OutdatedBrowserBanner.helpers";
import type { BrowserName } from "@/components/OutdatedBrowserBanner/OutdatedBrowserBanner.types";

// Returned together so the dismiss action always belongs to the notice currently on screen.
export interface OutdatedBrowser {
  browser: BrowserName | null;
  dismiss: () => void;
}

// Dismissing happens in this tab, where the `storage` event never fires, so it needs its own notification.
const listeners = new Set<() => void>();

// Nothing external changes while the page is open, so only in-tab dismissals need to trigger a re-read.
function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

// A primitive name keeps the snapshot referentially stable, which useSyncExternalStore needs to avoid render loops.
function getSnapshot(): BrowserName | null {
  const browser = detectBrowser(navigator.userAgent);
  if (!browser || !isBrowserOutdated(browser) || isOutdatedBrowserBannerDismissed()) return null;
  return browser.name;
}

// The user agent only exists in the browser, so the server renders no notice and hydration stays consistent.
function getServerSnapshot(): null {
  return null;
}

// Reads the reader's browser as an external store so the notice appears after hydration without an effect.
export function useOutdatedBrowser(): OutdatedBrowser {
  const browser = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Stable identity keeps the close button from re-rendering whenever the banner does.
  const dismiss = useCallback(() => {
    dismissOutdatedBrowserBanner();
    listeners.forEach((listener) => listener());
  }, []);

  return { browser, dismiss };
}
