import { GOOGLE_SNIPPET_MAX_CHARS, GOOGLE_TITLE_MAX_CHARS, isAbsoluteHttpUrl, isHexColour } from "@/utils/open-graph-text";
import type { AuditCheck, ImageMeasurement, LocalImage, OpenGraphFields } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// The size Facebook, LinkedIn and X all recommend for a large image — below it, cards render soft or fall back to a small thumbnail.
export const RECOMMENDED_IMAGE_WIDTH = 1200;

// Paired with the width above — 630 is what gives the 1.91:1 crop every large card uses.
export const RECOMMENDED_IMAGE_HEIGHT = 630;

// Roughly the smallest image Facebook will still show as a large card rather than a thumbnail.
const MINIMUM_LARGE_WIDTH = 600;

// The matching floor on height — half the recommended size, keeping the same 1.91:1 shape.
const MINIMUM_LARGE_HEIGHT = 314;

// 1200 ÷ 630 — the aspect ratio every large-image card crops to.
const LARGE_ASPECT = 1.91;

// ±5% either side of 1.91:1 crops so little that nobody would notice, so it still passes.
const ASPECT_TOLERANCE = 0.05;

// X's own cap on image alt text.
const ALT_MAX_CHARS = 420;

// Shortest description that tends to survive as-is in a search snippet rather than being replaced by text Google pulls from the page.
const DESCRIPTION_MIN_CHARS = 50;

// Titles shorter than this rarely say enough to earn a click.
const TITLE_MIN_CHARS = 15;

// Builds one check — a tiny constructor so every rule below reads as a single expression per outcome.
function check(id: string, label: string, status: AuditCheck["status"], message: string): AuditCheck {
  return { id, label, status, message };
}

// Title length against Google's ~60-character cut-off — the tightest of the platforms' limits, so passing it passes them all.
function auditTitle(fields: OpenGraphFields): AuditCheck {
  const length = fields.title.trim().length;
  if (length === 0) return check("title", "Title", "fail", "No title set — platforms will fall back to the raw URL or page heading.");
  if (length < TITLE_MIN_CHARS) return check("title", "Title", "warn", `Only ${length} characters — a slightly longer title gives readers more reason to click.`);
  if (length > GOOGLE_TITLE_MAX_CHARS) return check("title", "Title", "warn", `${length} characters — Google will likely truncate anything past about ${GOOGLE_TITLE_MAX_CHARS}.`);
  return check("title", "Title", "pass", `${length} characters — comfortably within every platform's limit.`);
}

// Description length against the ~155–160 characters a desktop search snippet shows.
function auditDescription(fields: OpenGraphFields): AuditCheck {
  const length = fields.description.trim().length;
  if (length === 0) return check("description", "Description", "fail", "No description set — Google will improvise a snippet from the page and most cards will show none.");
  if (length < DESCRIPTION_MIN_CHARS) return check("description", "Description", "warn", `Only ${length} characters — short descriptions are often replaced by text pulled from the page.`);
  if (length > GOOGLE_SNIPPET_MAX_CHARS + 2) return check("description", "Description", "warn", `${length} characters — expect it to be cut off after about 160.`);
  return check("description", "Description", "pass", `${length} characters — fits a search snippet without being cut off.`);
}

// Whether any image will appear at all — the single biggest factor in how prominent a shared link looks.
function auditImagePresent(fields: OpenGraphFields, localImage: LocalImage | null): AuditCheck {
  if (localImage) return check("image", "Image", "warn", `Previewing the local file “${localImage.name}” — upload it somewhere public and paste that URL before shipping.`);
  if (fields.imageUrl.trim().length === 0) return check("image", "Image", "fail", "No og:image set — links will unfurl as text only, or not at all.");
  return check("image", "Image", "pass", "An og:image is set.");
}

/*
  Real pixel dimensions, read from the loaded image's naturalWidth/naturalHeight — the only honest
  source on a static site, since the URL says nothing about size and there's no server to probe it.
  Size and aspect ratio are separate checks because they fail for different reasons (a soft image
  vs. a cropped one) and need different fixes.
*/
function auditImageDimensions(measurement: ImageMeasurement, hasImage: boolean): AuditCheck[] {
  if (!hasImage) return [];
  if (measurement.status === "loading" || measurement.status === "none") {
    return [check("image-size", "Image size", "warn", "Still loading the image to measure it…")];
  }
  if (measurement.status === "error") {
    return [check("image-size", "Image size", "fail", "The image failed to load here — crawlers will likely fail to fetch it too.")];
  }

  const { width, height } = measurement;
  const sizeCheck =
    width >= RECOMMENDED_IMAGE_WIDTH && height >= RECOMMENDED_IMAGE_HEIGHT
      ? check("image-size", "Image size", "pass", `${width}×${height} — meets the recommended ${RECOMMENDED_IMAGE_WIDTH}×${RECOMMENDED_IMAGE_HEIGHT}.`)
      : width >= MINIMUM_LARGE_WIDTH && height >= MINIMUM_LARGE_HEIGHT
        ? check("image-size", "Image size", "warn", `${width}×${height} — usable, but below the recommended ${RECOMMENDED_IMAGE_WIDTH}×${RECOMMENDED_IMAGE_HEIGHT}, so it may look soft on high-density screens.`)
        : check("image-size", "Image size", "fail", `${width}×${height} — too small for a large card; most platforms will shrink it to a thumbnail.`);

  const ratio = width / height;
  const drift = Math.abs(ratio - LARGE_ASPECT) / LARGE_ASPECT;
  const aspectCheck =
    drift <= ASPECT_TOLERANCE
      ? check("image-aspect", "Aspect ratio", "pass", `${ratio.toFixed(2)}:1 — matches the 1.91:1 large-card crop.`)
      : check("image-aspect", "Aspect ratio", "warn", `${ratio.toFixed(2)}:1 — large cards crop to 1.91:1, so the ${ratio > LARGE_ASPECT ? "sides" : "top and bottom"} will be trimmed.`);

  return [sizeCheck, aspectCheck];
}

// Alt text for the share image — screen-reader users on X and LinkedIn get this instead of the picture.
function auditAlt(fields: OpenGraphFields, hasImage: boolean): AuditCheck | null {
  if (!hasImage) return null;
  const length = fields.imageAlt.trim().length;
  if (length === 0) return check("image-alt", "Image alt text", "warn", "No og:image:alt — screen-reader users won't know what the image shows.");
  if (length > ALT_MAX_CHARS) return check("image-alt", "Image alt text", "warn", `${length} characters — X cuts alt text off at ${ALT_MAX_CHARS}.`);
  return check("image-alt", "Image alt text", "pass", "Alt text is set.");
}

/*
  Crawlers resolve nothing relative to the page — og:url, og:image and the favicon all have to be
  absolute. Each offending field is named in the message so the fix is obvious, and an empty
  canonical URL is its own warning since it also breaks the hostname shown on every card.
*/
function auditAbsoluteUrls(fields: OpenGraphFields, localImage: LocalImage | null): AuditCheck {
  const candidates: Array<[string, string]> = [
    ["canonical URL", fields.url],
    ["image URL", localImage ? "" : fields.imageUrl],
    ["favicon URL", fields.faviconUrl]
  ];
  const relative = candidates.filter(([, value]) => value.trim().length > 0 && !isAbsoluteHttpUrl(value)).map(([name]) => name);
  if (relative.length > 0) return check("absolute-urls", "Absolute URLs", "fail", `Not an absolute http(s) URL: ${relative.join(", ")} — crawlers won't resolve relative paths.`);
  if (fields.url.trim().length === 0) return check("absolute-urls", "Absolute URLs", "warn", "No canonical URL set — cards can't show a domain and shares may split across URL variants.");
  return check("absolute-urls", "Absolute URLs", "pass", "Every URL is absolute.");
}

// The card type decides whether X shows a large image at all, and a large card with no image is a wasted request.
function auditTwitterCard(fields: OpenGraphFields, hasImage: boolean): AuditCheck {
  if (fields.twitterCard === "") return check("twitter-card", "twitter:card", "warn", "Not set — X falls back to a small summary card.");
  if (fields.twitterCard === "summary_large_image" && !hasImage) return check("twitter-card", "twitter:card", "warn", "Set to summary_large_image, but there's no image to show.");
  return check("twitter-card", "twitter:card", "pass", `Set to ${fields.twitterCard}.`);
}

// og:type is technically required by the Open Graph spec, and some parsers treat a page without it as low-confidence.
function auditOgType(fields: OpenGraphFields): AuditCheck {
  if (fields.ogType === "") return check("og-type", "og:type", "warn", "Not set — the Open Graph spec requires it; \"website\" is the usual default.");
  return check("og-type", "og:type", "pass", `Set to ${fields.ogType}.`);
}

// Only checked when a theme-color is present — it's optional, but a malformed one silently falls back to grey in Slack and Discord.
function auditThemeColour(fields: OpenGraphFields): AuditCheck | null {
  if (fields.themeColor.trim().length === 0) return null;
  if (!isHexColour(fields.themeColor)) return check("theme-colour", "Theme colour", "warn", "Not a hex colour — embed accent bars will fall back to grey.");
  return check("theme-colour", "Theme colour", "pass", "A valid hex theme colour is set.");
}

// Runs every rule in a fixed order — failures aren't sorted to the top, so each check keeps a stable position while the user edits.
export function runAudit(fields: OpenGraphFields, localImage: LocalImage | null, measurement: ImageMeasurement): AuditCheck[] {
  const hasImage = localImage !== null || fields.imageUrl.trim().length > 0;
  return [
    auditTitle(fields),
    auditDescription(fields),
    auditImagePresent(fields, localImage),
    ...auditImageDimensions(measurement, hasImage),
    auditAlt(fields, hasImage),
    auditAbsoluteUrls(fields, localImage),
    auditTwitterCard(fields, hasImage),
    auditOgType(fields),
    auditThemeColour(fields)
  ].filter((result): result is AuditCheck => result !== null);
}
