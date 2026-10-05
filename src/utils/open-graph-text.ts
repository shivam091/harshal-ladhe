import type { LocalImage, OpenGraphFields, PreviewData } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// Google's title cut-off is really ~600px of pixel width; ~60 characters is the widely used character-count stand-in, and the preview also caps the line at 600px so both limits apply.
export const GOOGLE_TITLE_MAX_CHARS = 60;

// Google rewrites and trims snippets freely, but ~155–160 characters is where desktop results typically end.
export const GOOGLE_SNIPPET_MAX_CHARS = 158;

// Neutral grey for the Slack/Discord accent bar when no theme-color is set — what those clients fall back to as well.
const FALLBACK_ACCENT = "#9ca3af";

// Placeholder copy so an empty form still renders a recognisable card shape instead of a collapsed sliver.
const PLACEHOLDER_TITLE = "Untitled page";

/*
  Cuts at the last word boundary before `max` rather than mid-word, then appends an ellipsis —
  how search engines and most unfurlers trim, and noticeably easier to read than a hard slice.
  Falls back to a hard cut when a single "word" (a long URL, say) has no space to break at.
*/
export function truncateAtWord(text: string, max: number, ellipsis = "…"): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[\s,.;:–—-]+$/, "")}${ellipsis}`;
}

// Absolute http(s) only — protocol-relative, root-relative, data: and blob: URLs are all things crawlers either reject or can't fetch.
export function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Bare hostname without "www." — how every platform labels the source domain on a card.
export function displayHost(value: string): string {
  try {
    return new URL(value.trim()).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Google's "https://example.com › blog › post" breadcrumb, built from the URL's own path segments since there's no structured-data breadcrumb to read on a static page.
export function googleBreadcrumb(value: string): string {
  try {
    const url = new URL(value.trim());
    const segments = url.pathname.split("/").filter(Boolean).map((segment) => decodeURIComponent(segment));
    return [`${url.protocol}//${url.hostname}`, ...segments].join(" › ");
  } catch {
    return "";
  }
}

// Strips any leading "@"s so exports can add exactly one, however the handle was typed.
export function normaliseHandle(value: string): string {
  return value.trim().replace(/^@+/, "");
}

// A loose hex check — enough to decide whether to trust a theme-color for the accent bar, without pretending to be a full CSS colour parser.
export function isHexColour(value: string): boolean {
  return /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value.trim());
}

/*
  One interpretation of the fields shared by every card: the local upload wins over the URL field
  (it's what the user is actively trying out), the site name falls back to the hostname (as most
  unfurlers do), and the summary card is the default when `twitter:card` is unset — X's own
  behaviour for a missing tag.
*/
export function buildPreviewData(fields: OpenGraphFields, localImage: LocalImage | null): PreviewData {
  const host = displayHost(fields.url);
  const imageSrc = localImage?.url ?? fields.imageUrl.trim();
  return {
    title: fields.title.trim() || PLACEHOLDER_TITLE,
    description: fields.description.trim(),
    siteName: fields.siteName.trim() || host,
    host,
    breadcrumb: googleBreadcrumb(fields.url),
    imageSrc,
    imageAlt: fields.imageAlt.trim(),
    isLargeImage: fields.twitterCard === "summary_large_image",
    accentColour: isHexColour(fields.themeColor) ? fields.themeColor.trim() : FALLBACK_ACCENT,
    faviconSrc: fields.faviconUrl.trim(),
    handle: normaliseHandle(fields.twitterHandle)
  };
}
