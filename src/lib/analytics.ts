import { getSnippetBySlug } from "@/data/snippets";

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

export type ContentGroup = "snippet" | "listing" | "page";

export type ContentParams = {
  content_group: ContentGroup;
  content_category: string;
  content_tags: string;
};

// GA truncates long parameter values silently; cutting at a tag boundary keeps every tag that is sent whole.
const MAX_TAGS_LENGTH = 100;

const NONE = "(none)";

const LISTING_PATTERN = /^\/(snippets|goodies)?$/;

function joinTags(tags: string[]): string {
  let joined = "";
  for (const tag of tags) {
    const next = joined ? `${joined},${tag}` : tag;
    if (next.length > MAX_TAGS_LENGTH) break;
    joined = next;
  }
  return joined || NONE;
}

// Path-derived rather than passed from each page, so client-side navigations can be tagged without the page's help.
export function getContentParams(pathname: string): ContentParams {
  const path = pathname.replace(/\/$/, "") || "/";
  const [, segment, first] = path.split("/");

  if (segment === "snippet" && first) {
    const snippet = getSnippetBySlug(first);
    if (snippet) return { content_group: "snippet", content_category: NONE, content_tags: joinTags(snippet.tags) };
  }

  return { content_group: LISTING_PATTERN.test(path) ? "listing" : "page", content_category: NONE, content_tags: NONE };
}
