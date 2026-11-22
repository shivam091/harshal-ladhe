import { getPostBySlug } from "@/data/posts";
import { getTutorialBySlug } from "@/data/tutorials";
import { getSnippetBySlug } from "@/data/snippets";
import { getSeriesBySlug } from "@/data/series";
import { getPostCategorySlug } from "@/utils/post-url";
import { readConsentStatus } from "@/lib/consent";

export type GaParams = Record<string, string | number | boolean>;

export type ConsentState = "granted" | "denied";

// gtag comes from an external script, so TypeScript has to be told it may exist on window.
declare global {
  interface Window {
    // Set by gtag.js itself once it has loaded and configured a measurement ID.
    google_tag_manager?: Record<string, unknown>;
    // Set by the head's capture listener when the gtag.js request is rejected.
    __gaBlocked?: boolean;
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
  window.gtag("event", name, { consent_status: readConsentStatus(), ...params });
}

export type ContentGroup = "post" | "tutorial" | "snippet" | "series" | "listing" | "page";

export type ContentParams = {
  content_group: ContentGroup;
  content_category: string;
  content_tags: string;
};

// GA truncates long parameter values silently; cutting at a tag boundary keeps every tag that is sent whole.
const MAX_TAGS_LENGTH = 100;

const NONE = "(none)";

const LISTING_PATTERN = /^\/(posts|tutorials|snippets|series|archives|categories|category\/[^/]+|tags|tag\/[^/]+|goodies)?$/;

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
  const [, segment, first, second] = path.split("/");

  if (segment === "post" && second) {
    const post = getPostBySlug(second);
    if (post) {
      return { content_group: "post", content_category: getPostCategorySlug(post.category), content_tags: joinTags(post.tags) };
    }
  }

  if (segment === "tutorial" && first) {
    const tutorial = getTutorialBySlug(first);
    if (tutorial) return { content_group: "tutorial", content_category: NONE, content_tags: joinTags(tutorial.tags) };
  }

  if (segment === "snippet" && first) {
    const snippet = getSnippetBySlug(first);
    if (snippet) return { content_group: "snippet", content_category: NONE, content_tags: joinTags(snippet.tags) };
  }

  if (segment === "series" && first && getSeriesBySlug(first)) {
    return { content_group: "series", content_category: NONE, content_tags: NONE };
  }

  return { content_group: LISTING_PATTERN.test(path) ? "listing" : "page", content_category: NONE, content_tags: NONE };
}
