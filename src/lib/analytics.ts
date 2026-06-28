export type GaParams = Record<string, string | number | boolean>;

export type ConsentState = "granted" | "denied";

// gtag comes from an external script, so TypeScript has to be told it may exist on window.
declare global {
  interface Window {
    gtag?: {
      (command: "event", eventName: string, params?: GaParams): void;
      (command: "consent", action: "default" | "update", params: Record<string, ConsentState | number | string[]>): void;
    };
  }
}

/*
  gtag only exists in production (see the root layout) and may be blocked, so every event degrades to a no-op rather
  than breaking the interaction that triggered it.
*/
export function trackEvent(name: string, params: GaParams = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}

export type ContentGroup = "listing" | "page";

export type ContentParams = {
  content_group: ContentGroup;
  content_category: string;
  content_tags: string;
};

const NONE = "(none)";

const LISTING_PATTERN = /^\/(goodies)?$/;

// Path-derived rather than passed from each page, so client-side navigations can be tagged without the page's help.
export function getContentParams(pathname: string): ContentParams {
  const path = pathname.replace(/\/$/, "") || "/";

  return { content_group: LISTING_PATTERN.test(path) ? "listing" : "page", content_category: NONE, content_tags: NONE };
}
