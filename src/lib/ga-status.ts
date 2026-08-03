import { siteConfig } from "@/config/site";

// Whether gtag.js reached the browser; the difference between a reader GA could count and one an extension hid.
export type GaStatus = "loaded" | "blocked";

// gtag's own stub appears with the inline init, so outside production (no GA at all) this is how "nothing to report" shows.
const GTAG_WAIT_MS = 3000;

// Long enough for gtag.js on a slow connection, short enough that a blocked tag is reported while the page is still open.
const LOAD_WAIT_MS = 5000;

const POLL_MS = 100;

// Module-level so one page load asks once, however many views it sends.
let detection: Promise<GaStatus | null> | undefined;

// Polled because neither a load nor a block fires anything the page can subscribe to in time.
function waitFor(done: () => GaStatus | null, limitMs: number): Promise<GaStatus | null> {
  return new Promise((resolve) => {
    const startedAt = Date.now();
    const check = (): void => {
      const status = done();
      if (status || Date.now() - startedAt >= limitMs) resolve(status);
      else setTimeout(check, POLL_MS);
    };
    check();
  });
}

/*
  Null means there was no tag to judge (GA disabled here), which must not be reported as blocked. The error flag is set
  by a capture listener in the head, so an extension that rejects the script is reported at once rather than after the wait.
*/
export function detectGaStatus(): Promise<GaStatus | null> {
  detection ??= waitFor(() => (typeof window.gtag === "function" ? "loaded" : null), GTAG_WAIT_MS).then((stub) => {
    if (!stub) return null;
    return waitFor(
      () => (window.google_tag_manager?.[siteConfig.analytics.googleMeasurementId] ? "loaded" : window.__gaBlocked ? "blocked" : null),
      LOAD_WAIT_MS
    ).then((status) => status ?? "blocked");
  });
  return detection;
}
