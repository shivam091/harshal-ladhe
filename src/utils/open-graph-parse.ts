import type { HeadImportResult, OpenGraphFields, OpenGraphType, TwitterCardType } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// The minimal slice of DOMParser this module needs — typed structurally so tests can hand in any spec-compliant parser (happy-dom, jsdom) without a browser.
interface HtmlParser {
  parseFromString: (source: string, type: "text/html") => Document;
}

// Recognised `og:type` values; anything else imported is dropped to "" so the select and the audit both see it as unset rather than an unknown string.
const OG_TYPES: ReadonlyArray<OpenGraphType> = ["website", "article", "product", "profile"];

// Recognised `twitter:card` values; "player" and "app" cards aren't previewable here, so they import as unset.
const TWITTER_CARDS: ReadonlyArray<TwitterCardType> = ["summary", "summary_large_image"];

/*
  Reads a <meta> value by key, checking `property` before `name` — Open Graph specifies `property`,
  but plenty of real pages (and some CMSs) emit `name="og:title"`, and every major crawler
  accepts either, so the importer does too. Keys are matched case-insensitively for the same reason.
*/
function readMeta(doc: Document, key: string): string | null {
  const wanted = key.toLowerCase();
  for (const meta of Array.from(doc.querySelectorAll("meta"))) {
    const attribute = (meta.getAttribute("property") ?? meta.getAttribute("name") ?? "").trim().toLowerCase();
    if (attribute === wanted) {
      const content = meta.getAttribute("content");
      if (content !== null) return content.trim();
    }
  }
  return null;
}

// Finds a <link> whose space-separated rel list contains `token` — so "shortcut icon" still counts as an icon link.
function readLink(doc: Document, token: string): string | null {
  for (const link of Array.from(doc.querySelectorAll("link[rel][href]"))) {
    const rels = (link.getAttribute("rel") ?? "").toLowerCase().split(/\s+/);
    if (rels.includes(token)) return (link.getAttribute("href") ?? "").trim();
  }
  return null;
}

/*
  Turns a pasted <head> (or a whole page, or just a run of loose <meta> tags) into a full field set.
  Each field takes the first source that platforms themselves would prefer — og:* over twitter:*
  over plain HTML equivalents — mirroring the fallback chain crawlers actually use. Parsing goes
  through DOMParser so scripts never run and nothing is fetched; it's pure text inspection.
*/
export function parseHeadHtml(source: string, parser: HtmlParser): HeadImportResult {
  const doc = parser.parseFromString(source, "text/html");
  let matchedCount = 0;

  // Takes the first non-null candidate and counts it, so the result can report how much the paste actually contained.
  const pick = (...candidates: Array<string | null>): string => {
    for (const candidate of candidates) {
      if (candidate !== null) {
        matchedCount += 1;
        return candidate;
      }
    }
    return "";
  };

  const titleElement = doc.querySelector("title");
  const rawOgType = pick(readMeta(doc, "og:type")).toLowerCase();
  const rawCard = pick(readMeta(doc, "twitter:card")).toLowerCase();

  const fields: OpenGraphFields = {
    title: pick(readMeta(doc, "og:title"), readMeta(doc, "twitter:title"), titleElement ? (titleElement.textContent ?? "").trim() : null),
    description: pick(readMeta(doc, "og:description"), readMeta(doc, "twitter:description"), readMeta(doc, "description")),
    url: pick(readMeta(doc, "og:url"), readLink(doc, "canonical")),
    siteName: pick(readMeta(doc, "og:site_name"), readMeta(doc, "application-name")),
    imageUrl: pick(
      readMeta(doc, "og:image"),
      readMeta(doc, "og:image:url"),
      readMeta(doc, "og:image:secure_url"),
      readMeta(doc, "twitter:image"),
      readMeta(doc, "twitter:image:src")
    ),
    imageAlt: pick(readMeta(doc, "og:image:alt"), readMeta(doc, "twitter:image:alt")),
    twitterCard: (TWITTER_CARDS as ReadonlyArray<string>).includes(rawCard) ? (rawCard as TwitterCardType) : "",
    ogType: (OG_TYPES as ReadonlyArray<string>).includes(rawOgType) ? (rawOgType as OpenGraphType) : "",
    themeColor: pick(readMeta(doc, "theme-color")),
    faviconUrl: pick(readLink(doc, "icon"), readLink(doc, "apple-touch-icon")),
    author: pick(readMeta(doc, "author"), readMeta(doc, "article:author")),
    twitterHandle: pick(readMeta(doc, "twitter:site"), readMeta(doc, "twitter:creator"))
  };

  return { fields, matchedCount };
}
