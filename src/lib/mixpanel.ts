import type { Config, Dict, Mixpanel } from "mixpanel-browser";
import { siteConfig } from "@/config/site";
import type { ConsentStatus } from "@/lib/consent";
import { readConsentStatus } from "@/lib/consent";

// A neutral name, since filter lists target paths that say "mixpanel", "track" or "analytics".
export const MIXPANEL_PROXY_PATH = "/beam";

// Without the trailing slash Mixpanel's defaults carry, so Next doesn't answer every hit with a redirect first.
const API_ROUTES = { track: "track", engage: "engage", groups: "groups", record: "record", flags: "flags" };

// Set once by the analytics provider; null outside Vercel production, so previews and local runs never report.
let token: string | null = null;

// Module-level so every caller shares one SDK load, and nothing is loaded until a reader may be tracked.
let loading: Promise<Mixpanel | null> | undefined;

// Held until the SDK loads, so properties registered before then still reach the first event.
let pendingSuper: Dict = {};

export function configureMixpanel(value: string | null): void {
  token = value;
}

// The same rule as gtag's storage: an answer of yes, or a region where nobody has to be asked.
function mayTrack(status: ConsentStatus): boolean {
  return status === "granted" || status === "default";
}

function config(): Partial<Config> {
  return {
    api_host: `${window.location.origin}${MIXPANEL_PROXY_PATH}`,
    api_routes: API_ROUTES,
    // Sent by usePageViews once the new title is in, as for GA.
    track_pageview: false,
    autocapture: {
      pageview: false,
      click: true,
      input: true,
      submit: true,
      rage_click: true,
      dead_click: true,
      // Covered by the scroll_depth and page_leave events, which carry the content params.
      scroll: false,
      capture_text_content: false
    },
    record_sessions_percent: siteConfig.analytics.mixpanelReplayPercent,
    record_heatmap_data: true,
    // The prose is public anyway, and masked text makes a replay of a reading session useless; form fields stay masked.
    record_mask_all_text: false,
    record_mask_all_inputs: true,
    persistence: "cookie",
    secure_cookie: true
  };
}

// The SDK would load and then send nothing for these readers, so they're spared the download.
function doNotTrack(): boolean {
  return navigator.doNotTrack === "1" || (window as { doNotTrack?: string }).doNotTrack === "1";
}

function load(): Promise<Mixpanel | null> {
  const value = token;
  if (!value || doNotTrack()) return Promise.resolve(null);

  loading ??= import("mixpanel-browser")
    .then(({ default: mixpanel }) => {
      mixpanel.init(value, config());
      // An earlier decline left an opt-out behind; reaching here means the reader has since said yes.
      if (mixpanel.has_opted_out_tracking()) mixpanel.opt_in_tracking();
      mixpanel.register(pendingSuper);
      pendingSuper = {};
      return mixpanel;
    })
    // A failed chunk load is a lost visit, never an error for the reader.
    .catch(() => null);
  return loading;
}

/*
  Called whenever the reader's answer may have changed. A decline after loading stops recording and clears the
  Mixpanel cookie, so nothing more is sent this visit or the next.
*/
export function syncMixpanelConsent(status: ConsentStatus): void {
  if (!token) return;
  if (mayTrack(status)) {
    void load();
    return;
  }
  void loading?.then((mixpanel) => {
    if (!mixpanel) return;
    mixpanel.stop_session_recording();
    // The SDK clears its cookie on opting out; deleting the profile is for identified users, which readers never are.
    mixpanel.opt_out_tracking({ delete_user: false });
  });
}

// The status is passed in where the caller has already resolved it, so a landing page isn't judged before the region answer.
export function mixpanelTrack(
  name: string,
  properties: Dict = {},
  options: { transport?: "xhr" | "sendBeacon"; status?: ConsentStatus } = {}
): void {
  if (typeof window === "undefined" || !token) return;
  if (!mayTrack(options.status ?? readConsentStatus())) return;
  void load().then((mixpanel) => mixpanel?.track(name, properties, options.transport ? { transport: options.transport } : undefined));
}

export function mixpanelPageView(properties: Dict, status: ConsentStatus): void {
  if (typeof window === "undefined" || !token || !mayTrack(status)) return;
  void load().then((mixpanel) => mixpanel?.track_pageview(properties));
}

/*
  Named by the id the server gave a new subscriber, so their later visits join one profile. Only ever called with an
  id the server handed back, which it does only for a reader Mixpanel already tracks.
*/
export function mixpanelIdentify(readerId: string): void {
  if (!loading) return;
  void loading.then((mixpanel) => mixpanel?.identify(readerId));
}

// Super properties ride on every later event, so each report can be split by them without each call repeating them.
export function mixpanelRegister(properties: Dict): void {
  if (loading) {
    void loading.then((mixpanel) => mixpanel?.register(properties));
  } else {
    pendingSuper = { ...pendingSuper, ...properties };
  }
}
