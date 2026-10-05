import { escapeHTML } from "@/utils/string";
import { normaliseHandle } from "@/utils/open-graph-text";
import type { ImageMeasurement, LocalImage, OpenGraphFields } from "@/components/OpenGraphPreview/OpenGraphPreview.types";

// A <meta>/<link> tag as plain data, so the HTML and JSX exports are both generated from one tag list and can never disagree about what's included.
interface HeadTag {
  element: "meta" | "link" | "title";
  attributes: Array<[string, string]>;
  text?: string;
}

// Image dimensions worth exporting — only when they were measured from the same image the URL points at, since a local upload's size says nothing about whatever ends up hosted.
function exportableDimensions(measurement: ImageMeasurement, localImage: LocalImage | null): { width: number; height: number } | null {
  if (localImage || measurement.status !== "loaded") return null;
  return { width: measurement.width, height: measurement.height };
}

// Shorthand for a `<meta property=… content=…>` — only emitted when there's a value, so the export never carries empty tags.
function propertyTag(property: string, content: string): HeadTag | null {
  return content.trim() ? { element: "meta", attributes: [["property", property], ["content", content.trim()]] } : null;
}

// Shorthand for a `<meta name=… content=…>` — the attribute twitter:*, description, author and theme-color use instead of `property`.
function nameTag(name: string, content: string): HeadTag | null {
  return content.trim() ? { element: "meta", attributes: [["name", name], ["content", content.trim()]] } : null;
}

/*
  The canonical tag list every format renders from, in the order a hand-written <head> usually
  follows: document basics, then Open Graph, then X's overrides. twitter:title/description/image
  are emitted explicitly even though X falls back to og:*, because some other unfurlers only read
  the twitter:* set.
*/
function buildTags(fields: OpenGraphFields, measurement: ImageMeasurement, localImage: LocalImage | null): HeadTag[] {
  const dimensions = exportableDimensions(measurement, localImage);
  const handle = normaliseHandle(fields.twitterHandle);
  const tags: Array<HeadTag | null> = [
    fields.title.trim() ? { element: "title", attributes: [], text: fields.title.trim() } : null,
    nameTag("description", fields.description),
    fields.url.trim() ? { element: "link", attributes: [["rel", "canonical"], ["href", fields.url.trim()]] } : null,
    fields.faviconUrl.trim() ? { element: "link", attributes: [["rel", "icon"], ["href", fields.faviconUrl.trim()]] } : null,
    nameTag("theme-color", fields.themeColor),
    nameTag("author", fields.author),
    propertyTag("og:type", fields.ogType),
    propertyTag("og:site_name", fields.siteName),
    propertyTag("og:title", fields.title),
    propertyTag("og:description", fields.description),
    propertyTag("og:url", fields.url),
    propertyTag("og:image", fields.imageUrl),
    fields.imageUrl.trim() && dimensions ? propertyTag("og:image:width", String(dimensions.width)) : null,
    fields.imageUrl.trim() && dimensions ? propertyTag("og:image:height", String(dimensions.height)) : null,
    fields.imageUrl.trim() ? propertyTag("og:image:alt", fields.imageAlt) : null,
    nameTag("twitter:card", fields.twitterCard),
    handle ? nameTag("twitter:site", `@${handle}`) : null,
    nameTag("twitter:title", fields.title),
    nameTag("twitter:description", fields.description),
    nameTag("twitter:image", fields.imageUrl),
    fields.imageUrl.trim() ? nameTag("twitter:image:alt", fields.imageAlt) : null
  ];
  return tags.filter((tag): tag is HeadTag => tag !== null);
}

// Plain HTML <head> markup — attribute values escaped, since titles and descriptions routinely contain quotes and ampersands.
export function toHtmlMetaTags(fields: OpenGraphFields, measurement: ImageMeasurement, localImage: LocalImage | null): string {
  const lines = buildTags(fields, measurement, localImage).map((tag) => {
    if (tag.element === "title") return `<title>${escapeHTML(tag.text ?? "")}</title>`;
    const attributes = tag.attributes.map(([key, value]) => `${key}="${escapeHTML(value)}"`).join(" ");
    return `<${tag.element} ${attributes} />`;
  });
  return lines.length > 0 ? lines.join("\n") : "<!-- Fill in the form to generate tags. -->";
}

// A plain quoted JSX attribute where that's safe, falling back to a `{"…"}` expression (escaped by JSON.stringify) only when the value holds a quote, backslash or line break that a bare JSX attribute can't express.
function jsxAttributeValue(value: string): string {
  return /["\\\n]/.test(value) ? `{${JSON.stringify(value)}}` : `"${value}"`;
}

// `next/head` markup for the Pages Router, where the App Router's metadata export isn't available — the same tag list rendered as JSX with `key`s so Next de-duplicates them across pages.
export function toReactHead(fields: OpenGraphFields, measurement: ImageMeasurement, localImage: LocalImage | null): string {
  const tags = buildTags(fields, measurement, localImage).map((tag) => {
    if (tag.element === "title") return `      <title>{${JSON.stringify(tag.text ?? "")}}</title>`;
    const key = tag.attributes[0]?.[1] ?? tag.element;
    const attributes = tag.attributes.map(([name, value]) => `${name}=${jsxAttributeValue(value)}`).join(" ");
    return `      <${tag.element} key="${key}" ${attributes} />`;
  });

  return [
    `import Head from "next/head";`,
    ``,
    `export default function PageHead() {`,
    `  return (`,
    `    <Head>`,
    ...tags,
    `    </Head>`,
    `  );`,
    `}`
  ].join("\n");
}

// Serialises a plain value as a TS object-literal fragment, quoting keys only when they need it so the output reads like hand-written code rather than JSON.
function toObjectLiteral(value: unknown, indent: string): string {
  if (Array.isArray(value)) {
    const inner = value.map((item) => `${indent}  ${toObjectLiteral(item, `${indent}  `)}`).join(",\n");
    return `[\n${inner}\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).map(([key, item]) => {
      const safeKey = /^[A-Za-z_$][\w$]*$/.test(key) ? key : JSON.stringify(key);
      return `${indent}  ${safeKey}: ${toObjectLiteral(item, `${indent}  `)}`;
    });
    return `{\n${entries.join(",\n")}\n${indent}}`;
  }
  return JSON.stringify(value);
}

// Drops undefined/empty entries recursively so the generated metadata object only lists what was actually filled in.
function compact(value: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value)) {
    if (item === undefined || item === "") continue;
    if (Array.isArray(item)) {
      if (item.length > 0) result[key] = item;
    } else if (item && typeof item === "object") {
      const nested = compact(item as Record<string, unknown>);
      if (Object.keys(nested).length > 0) result[key] = nested;
    } else {
      result[key] = item;
    }
  }
  return result;
}

/*
  An App Router `metadata` export typed against Next's own Metadata type. `metadataBase` is taken
  from the canonical URL's origin so relative paths elsewhere in the app resolve correctly, and
  theme-color goes in a separate `viewport` export — Next moved it there and warns if it's left in
  `metadata`.
*/
export function toNextMetadata(fields: OpenGraphFields, measurement: ImageMeasurement, localImage: LocalImage | null): string {
  const dimensions = exportableDimensions(measurement, localImage);
  const handle = normaliseHandle(fields.twitterHandle);
  const imageUrl = fields.imageUrl.trim();
  let origin = "";
  try {
    origin = fields.url.trim() ? new URL(fields.url.trim()).origin : "";
  } catch {
    origin = "";
  }

  const image = imageUrl ? compact({ url: imageUrl, width: dimensions?.width, height: dimensions?.height, alt: fields.imageAlt.trim() }) : undefined;

  const metadata = compact({
    title: fields.title.trim(),
    description: fields.description.trim(),
    authors: fields.author.trim() ? [{ name: fields.author.trim() }] : undefined,
    alternates: { canonical: fields.url.trim() },
    icons: fields.faviconUrl.trim() ? { icon: fields.faviconUrl.trim() } : undefined,
    openGraph: {
      type: fields.ogType || undefined,
      url: fields.url.trim(),
      siteName: fields.siteName.trim(),
      title: fields.title.trim(),
      description: fields.description.trim(),
      images: image ? [image] : undefined
    },
    twitter: {
      card: fields.twitterCard || undefined,
      site: handle ? `@${handle}` : undefined,
      title: fields.title.trim(),
      description: fields.description.trim(),
      images: image ? [image] : undefined
    }
  });

  const metadataBody = toObjectLiteral(origin ? { metadataBase: "__METADATA_BASE__", ...metadata } : metadata, "").replace(
    `"__METADATA_BASE__"`,
    `new URL(${JSON.stringify(origin)})`
  );
  const themeColour = fields.themeColor.trim();

  return [
    themeColour ? `import type { Metadata, Viewport } from "next";` : `import type { Metadata } from "next";`,
    ``,
    `export const metadata: Metadata = ${metadataBody};`,
    ...(themeColour ? [``, `export const viewport: Viewport = {`, `  themeColor: ${JSON.stringify(themeColour)}`, `};`] : [])
  ].join("\n");
}
