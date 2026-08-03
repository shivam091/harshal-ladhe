/*
  Off unless NEXT_PUBLIC_GA_PROXY=1 at build time, because proxying changes where every hit goes and has to be checked
  in GA's realtime report (geography in particular) before it is trusted. Consent Mode is untouched either way.
*/
export const GA_PROXY_ENABLED = process.env.NEXT_PUBLIC_GA_PROXY === "1";

// A neutral name, since filter lists target paths that say "analytics" or "gtag".
export const GA_PROXY_PATH = "/stats";

// Where each proxied path really lives; anything else is refused so the route can't be used as an open relay.
export const GA_PROXY_UPSTREAMS: Record<string, string> = {
  "s.js": "https://www.googletagmanager.com/gtag/js",
  "g/collect": "https://www.google-analytics.com/g/collect",
  "g/s/collect": "https://www.google-analytics.com/g/s/collect"
};
