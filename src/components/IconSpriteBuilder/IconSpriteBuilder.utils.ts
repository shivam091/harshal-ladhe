import { escapeXml } from "@/utils/string";
import type {
  CleanCounts,
  ProcessedIcon,
  SnippetFlavour,
  SpriteBuildOptions,
  SpriteBuildResult,
  SpriteElementNode,
  SpriteIcon,
  SpriteNode,
  SpriteNote,
  SpriteParseResult
} from "@/components/IconSpriteBuilder/IconSpriteBuilder.types";

// DOM nodeType constants spelled out locally — the Node global doesn't exist during server rendering, and the values are fixed by the DOM spec.
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const CDATA_SECTION_NODE = 4;

// Elements outside this namespace (or none) belong to an editor such as Inkscape and never reach the sprite.
const SVG_NS = "http://www.w3.org/2000/svg";

// Firefox reports XML errors in a namespaced <parsererror> root rather than Chrome's plain one, so both lookups are needed.
const MOZ_PARSER_ERROR_NS = "http://www.mozilla.org/newlayout/xml/parsererror.xml";

// Elements whose text is content rather than formatting whitespace.
const TEXT_BEARING_ELEMENTS = new Set(["text", "tspan", "textPath", "title", "desc"]);

// Elements that can run script or embed other documents — removed outright and reported as warnings.
const UNSAFE_ELEMENTS = new Set(["script", "foreignObject", "iframe", "embed", "object", "handler", "listener", "audio", "video", "canvas", "feImage"]);

// Wrappers with no drawing of their own — their children are kept, but the link or switch itself is dropped so a stamp can't navigate anywhere.
const UNWRAP_ELEMENTS = new Set(["a", "switch"]);

/*
  Everything a static icon legitimately needs. Anything else (<metadata>, <style>, editor-namespaced
  elements) is dropped: a <style> sheet inside a sprite would restyle the whole page it's inlined into.
*/
const ALLOWED_ELEMENTS = new Set([
  "svg", "g", "defs", "symbol", "use", "path", "rect", "circle", "ellipse", "line", "polyline", "polygon",
  "text", "tspan", "textPath", "title", "desc", "linearGradient", "radialGradient", "stop", "clipPath", "mask",
  "pattern", "marker", "image", "filter", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite",
  "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood",
  "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology",
  "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "animate",
  "animateTransform", "animateMotion", "set", "mpath"
]);

// Outer-<svg> attributes that belong to a standalone file, not a symbol — sizing comes from the <use> site and the namespace from the sprite.
const ROOT_DROPPED_ATTRIBUTES = new Set(["width", "height", "x", "y", "xmlns", "version", "baseProfile", "id", "viewBox", "enable-background", "xml:space", "data-name", "role", "aria-hidden", "aria-labelledby", "aria-describedby", "focusable"]);

// Properties the currentColor switch may rewrite — stop-color is left alone so gradients keep their designed stops.
const COLOUR_PROPERTIES = new Set(["fill", "stroke", "color"]);

// Values that aren't a baked-in colour, so currentColor must leave them untouched.
const NON_COLOUR_VALUES = new Set(["none", "transparent", "currentcolor", "inherit", "initial", "unset", "revert", "context-fill", "context-stroke"]);

// Attributes that hold a whitespace-separated list of id references rather than a single one.
const ID_LIST_ATTRIBUTES = new Set(["aria-labelledby", "aria-describedby"]);

// A safe attribute name — anything else is dropped rather than risk breaking out of the serialised tag.
const SAFE_ATTRIBUTE_NAME = /^[A-Za-z_][\w.:-]*$/;

// Fallback when a source has neither a viewBox nor usable width/height — the most common icon grid.
const FALLBACK_VIEWBOX = "0 0 24 24";

// Width the <use> snippets are written at; height follows the icon's own aspect ratio.
const SNIPPET_SIZE = 24;

// "1 thing" / "2 things" — the notes read as sentences, so plurals must agree.
function plural(count: number, word: string): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

/*
  Turns any label into a safe symbol id: lowercase letters, digits and single hyphens, starting with
  a letter. Underscores are folded too, which keeps the "__" separator used for internal ids from
  ever colliding with a symbol id.
*/
export function slugifyId(input: string): string {
  const slug = input
    .toLowerCase()
    .replace(/\.svg$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length === 0) return "icon";
  return /^[a-z]/.test(slug) ? slug : `icon-${slug}`;
}

// Appends -2, -3, … until the slug is free, so two "home" icons can still both be referenced.
export function uniqueId(base: string, taken: Set<string>): string {
  const slug = slugifyId(base);
  if (!taken.has(slug)) return slug;
  let suffix = 2;
  while (taken.has(`${slug}-${suffix}`)) suffix++;
  return `${slug}-${suffix}`;
}

// The ids the sprite actually uses — the raw typed ids stay editable while this guarantees every symbol id is valid and unique.
export function resolveIds(rawIds: string[]): string[] {
  const taken = new Set<string>();
  return rawIds.map((raw) => {
    const id = uniqueId(raw, taken);
    taken.add(id);
    return id;
  });
}

// Bytes as a file on disk would count them, so the comparison reflects real transfer size rather than string length.
export function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

// Icons are a few hundred bytes each, so one decimal place of kilobytes is plenty.
export function formatBytes(bytes: number): string {
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} kB`;
}

// Hands output over as a real file via a temporary object URL, revoked straight after so repeated downloads don't leak blobs.
export function downloadFile(fileName: string, contents: string, type = "image/svg+xml;charset=utf-8"): void {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

// Browsers wrap the actual XML error in boilerplate — strip it so the stamp shows one clear sentence.
function describeParserError(errorElement: Element): string {
  const detail = errorElement.querySelector("div")?.textContent ?? errorElement.textContent ?? "";
  const cleaned = detail
    .replace(/This page contains the following errors:/i, "")
    .replace(/Below is a rendering of the page up to the first error\.?/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 0 ? `Invalid SVG — ${cleaned}` : "Invalid SVG — the XML parser couldn't read it.";
}

// Copies a live DOM element into the plain tree; elements from editor namespaces (sodipodi:, inkscape:) never make it across.
function toSpriteNode(element: Element): SpriteElementNode {
  const keepsText = TEXT_BEARING_ELEMENTS.has(element.localName);
  const children: SpriteNode[] = [];

  element.childNodes.forEach((child) => {
    if (child.nodeType === ELEMENT_NODE) {
      const childElement = child as Element;
      const inSvg = childElement.namespaceURI === SVG_NS || childElement.namespaceURI === null;
      children.push(inSvg ? toSpriteNode(childElement) : { kind: "element", name: `ns:${childElement.localName}`, attributes: [], children: [] });
    } else if (keepsText && (child.nodeType === TEXT_NODE || child.nodeType === CDATA_SECTION_NODE)) {
      const value = (child.nodeValue ?? "").replace(/\s+/g, " ").trim();
      if (value.length > 0) children.push({ kind: "text", value });
    }
  });

  return {
    kind: "element",
    name: element.localName,
    attributes: Array.from(element.attributes).map((attribute) => [attribute.name, attribute.value.replace(/\s+/g, " ").trim()]),
    children
  };
}

/*
  Parses one icon with the browser's XML parser (strict, so an unclosed tag is a clear error rather
  than HTML's silent recovery). Markup copied out of an HTML page often uses xlink:href without
  declaring the namespace, so that declaration is added first rather than failing the whole icon.
*/
export function parseSvg(source: string): SpriteParseResult {
  let trimmed = source.trim();
  if (trimmed.length === 0) return { root: null, error: "This mount is empty — paste or drop some SVG markup." };
  if (typeof DOMParser === "undefined") return { root: null, error: "SVG parsing needs a browser — reload the page with JavaScript enabled." };
  if (/\sxlink:/.test(trimmed) && !/xmlns:xlink\s*=/.test(trimmed)) {
    trimmed = trimmed.replace(/<svg\b/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  const doc = new DOMParser().parseFromString(trimmed, "image/svg+xml");
  const errorElement = doc.getElementsByTagName("parsererror")[0] ?? doc.getElementsByTagNameNS(MOZ_PARSER_ERROR_NS, "parsererror")[0];
  if (errorElement) return { root: null, error: describeParserError(errorElement) };

  const rootElement = doc.documentElement;
  if (!rootElement || rootElement.localName !== "svg") {
    return { root: null, error: `Expected an <svg> root but found <${rootElement?.localName ?? "nothing"}>.` };
  }
  return { root: toSpriteNode(rootElement), error: null };
}

// Strips control characters and whitespace before checking a URL's scheme — browsers ignore both, so "java\tscript:" must be caught too.
function isDangerousUrl(value: string): boolean {
  const normalised = value.replace(/[\u0000- ]/g, "").toLowerCase();
  if (/^(?:javascript|vbscript):/.test(normalised)) return true;
  return normalised.startsWith("data:") && !/^data:image\/(?:png|jpe?g|gif|webp);/.test(normalised);
}

// Reads one attribute by name — the tree stores pairs, so this saves repeating the find at every call site.
function getAttribute(node: SpriteElementNode, name: string): string | undefined {
  return node.attributes.find(([attributeName]) => attributeName === name)?.[1];
}

// href wins over the legacy xlink:href, matching how browsers resolve the pair.
function getHref(node: SpriteElementNode): string | undefined {
  return getAttribute(node, "href") ?? getAttribute(node, "xlink:href");
}

/*
  The always-on safety and tidying pass. Script-capable elements, on* handlers and javascript:/
  non-image data: URLs go; links are unwrapped; external <use>/<image> references are removed so a
  sprite never fetches anything; xlink:href becomes plain href; editor-namespaced attributes vanish.
*/
function cleanTree(node: SpriteElementNode, counts: CleanCounts): void {
  const nextChildren: SpriteNode[] = [];
  for (const child of node.children) {
    if (child.kind === "text") {
      nextChildren.push(child);
      continue;
    }
    if (UNSAFE_ELEMENTS.has(child.name)) {
      counts.unsafe++;
      continue;
    }
    const animated = getAttribute(child, "attributeName")?.toLowerCase();
    if (["set", "animate"].includes(child.name) && (animated === "href" || animated === "xlink:href")) {
      counts.unsafe++;
      continue;
    }
    if (UNWRAP_ELEMENTS.has(child.name)) {
      cleanTree(child, counts);
      nextChildren.push(...child.children);
      continue;
    }
    if (child.name === "style") {
      counts.stylesheets++;
      continue;
    }
    if (!ALLOWED_ELEMENTS.has(child.name)) {
      counts.dropped++;
      continue;
    }
    const href = getHref(child);
    if ((child.name === "use" && href !== undefined && !href.startsWith("#")) || (child.name === "image" && (href === undefined || !/^data:image\//i.test(href)))) {
      counts.urls++;
      continue;
    }
    cleanTree(child, counts);
    nextChildren.push(child);
  }
  node.children = nextChildren;

  const hasHref = node.attributes.some(([name]) => name === "href");
  node.attributes = node.attributes.flatMap(([name, value]): Array<[string, string]> => {
    if (/^on/i.test(name)) {
      counts.handlers++;
      return [];
    }
    if (isDangerousUrl(value) || (name === "style" && /javascript:|expression\s*\(|@import|url\(\s*['"]?(?!#)/i.test(value))) {
      counts.urls++;
      return [];
    }
    if (!SAFE_ATTRIBUTE_NAME.test(name) || name === "xmlns" || name.startsWith("xmlns:")) return [];
    if (name === "xlink:href") return hasHref ? [] : [["href", value]];
    if (name.includes(":") && !name.startsWith("xml:")) {
      counts.editorAttributes++;
      return [];
    }
    return [[name, value]];
  });
}

// Depth-first visit of every element, so the id and colour passes each stay a few lines long.
function walkElements(node: SpriteElementNode, visit: (element: SpriteElementNode, insideMask: boolean) => void, insideMask = false): void {
  visit(node, insideMask);
  for (const child of node.children) {
    if (child.kind === "element") walkElements(child, visit, insideMask || child.name === "mask");
  }
}

// Every id something inside the icon actually points at — the rest are editor leftovers ("path1") that only add bytes and collision risk.
function collectReferencedIds(root: SpriteElementNode): Set<string> {
  const referenced = new Set<string>();
  walkElements(root, (element) => {
    for (const [name, value] of element.attributes) {
      for (const match of value.matchAll(/url\(\s*['"]?#([^'")\s]+)/g)) referenced.add(match[1]);
      if (name === "href" && value.startsWith("#")) referenced.add(value.slice(1));
      if (ID_LIST_ATTRIBUTES.has(name)) value.split(/\s+/).forEach((ref) => referenced.add(ref));
    }
  });
  return referenced;
}

/*
  Namespaces every referenced internal id (gradients, clipPaths, masks, filters) under its
  symbol's id, rewrites every reference — url(#…), href="#…" and aria id lists — to match, and
  drops ids nothing references. Without the prefix, two icons that both define "gradient-1" would
  silently share whichever one the page met first.
*/
function prefixInternalIds(root: SpriteElementNode, symbolId: string): { prefixed: number; removed: number } {
  const referenced = collectReferencedIds(root);
  const renames = new Map<string, string>();
  let removed = 0;
  walkElements(root, (element) => {
    if (element === root) return;
    const id = getAttribute(element, "id");
    if (!id) return;
    if (referenced.has(id)) {
      renames.set(id, `${symbolId}__${id}`);
      return;
    }
    element.attributes = element.attributes.filter(([name]) => name !== "id");
    removed++;
  });
  if (renames.size === 0) return { prefixed: 0, removed };

  walkElements(root, (element) => {
    element.attributes = element.attributes.map(([name, value]): [string, string] => {
      if (name === "id") return [name, renames.get(value) ?? value];
      if (name === "href" && value.startsWith("#")) return [name, `#${renames.get(value.slice(1)) ?? value.slice(1)}`];
      if (ID_LIST_ATTRIBUTES.has(name)) return [name, value.split(/\s+/).map((ref) => renames.get(ref) ?? ref).join(" ")];
      return [name, value.replace(/url\(\s*(['"]?)#([^'")\s]+)\1\s*\)/g, (match, quote: string, ref: string) => (renames.has(ref) ? `url(#${renames.get(ref)})` : match))];
    });
  });
  return { prefixed: renames.size, removed };
}

// A colour the currentColor switch should replace — anything that isn't a keyword or a paint-server reference.
function isHardCodedColour(value: string): boolean {
  const lower = value.trim().toLowerCase();
  return lower.length > 0 && !NON_COLOUR_VALUES.has(lower) && !lower.startsWith("url(") && !lower.startsWith("var(");
}

/*
  Swaps baked-in fill/stroke/color values (attributes and inline style declarations) for
  currentColor, so the icon follows the surrounding text colour. Anything inside a <mask> is left
  alone, since a mask works on luminance and recolouring it would change which pixels show.
*/
function applyCurrentColor(root: SpriteElementNode): number {
  let changed = 0;
  walkElements(root, (element, insideMask) => {
    if (insideMask) return;
    element.attributes = element.attributes.map(([name, value]): [string, string] => {
      if (COLOUR_PROPERTIES.has(name) && isHardCodedColour(value)) {
        changed++;
        return [name, "currentColor"];
      }
      if (name !== "style") return [name, value];
      const rewritten = value
        .split(";")
        .map((declaration) => {
          const [property, ...rest] = declaration.split(":");
          const propertyName = property?.trim().toLowerCase() ?? "";
          const propertyValue = rest.join(":").trim();
          if (!COLOUR_PROPERTIES.has(propertyName) || !isHardCodedColour(propertyValue)) return declaration.trim();
          changed++;
          return `${propertyName}: currentColor`;
        })
        .filter(Boolean)
        .join("; ");
      return [name, rewritten];
    });
  });
  return changed;
}

// Reads the viewBox if it's four sane numbers, otherwise derives one from width/height, otherwise falls back — reporting which happened.
function resolveViewBox(root: SpriteElementNode, notes: SpriteNote[]): string {
  const raw = getAttribute(root, "viewBox")?.trim().split(/[\s,]+/).map(Number);
  if (raw && raw.length === 4 && raw.every(Number.isFinite) && raw[2] > 0 && raw[3] > 0) return raw.join(" ");
  const width = parseFloat(getAttribute(root, "width") ?? "");
  const height = parseFloat(getAttribute(root, "height") ?? "");
  if (width > 0 && height > 0) {
    notes.push({ message: `No viewBox — derived 0 0 ${width} ${height} from width/height`, tone: "info" });
    return `0 0 ${width} ${height}`;
  }
  notes.push({ message: `No viewBox or size — assumed ${FALLBACK_VIEWBOX}`, tone: "warning" });
  return FALLBACK_VIEWBOX;
}

// Prints one node as indented markup, keeping text-only elements (<title>, <tspan>) on a single line.
function serialiseNode(node: SpriteNode, depth: number): string {
  const pad = "  ".repeat(depth);
  if (node.kind === "text") return `${pad}${escapeXml(node.value)}`;
  const attributes = node.attributes.map(([name, value]) => ` ${name}="${escapeXml(value)}"`).join("");
  if (node.children.length === 0) return `${pad}<${node.name}${attributes}/>`;
  if (node.children.every((child) => child.kind === "text")) {
    return `${pad}<${node.name}${attributes}>${node.children.map((child) => (child.kind === "text" ? escapeXml(child.value) : "")).join(" ")}</${node.name}>`;
  }
  const inner = node.children.map((child) => serialiseNode(child, depth + 1)).join("\n");
  return `${pad}<${node.name}${attributes}>\n${inner}\n${pad}</${node.name}>`;
}

// Turns the clean-up tallies into the stamp's notes, warnings first since those are what a reviewer should see.
function describeCleanCounts(counts: CleanCounts): SpriteNote[] {
  const notes: SpriteNote[] = [];
  if (counts.unsafe) notes.push({ message: `Removed ${plural(counts.unsafe, "unsafe element")} (<script>, <foreignObject>, …)`, tone: "warning" });
  if (counts.handlers) notes.push({ message: `Removed ${plural(counts.handlers, "event handler")} (onclick, onload, …)`, tone: "warning" });
  if (counts.urls) notes.push({ message: `Removed ${plural(counts.urls, "unsafe or external URL")}`, tone: "warning" });
  if (counts.stylesheets) notes.push({ message: `Dropped ${plural(counts.stylesheets, "<style> sheet")} — it would restyle the whole page`, tone: "warning" });
  if (counts.dropped) notes.push({ message: `Dropped ${plural(counts.dropped, "editor or unsupported element")}`, tone: "info" });
  if (counts.editorAttributes) notes.push({ message: `Dropped ${plural(counts.editorAttributes, "editor attribute")}`, tone: "info" });
  return notes;
}

/*
  Runs one icon through the full pipeline — parse, sanitise, viewBox, id prefixing, optional
  currentColor — and emits its <symbol>. The outer <svg>'s presentation attributes (fill="none",
  stroke-width, …) move onto the symbol, where they still inherit down to every shape.
*/
export function processIcon(icon: SpriteIcon, id: string, currentColor: boolean, idPrefix: string): ProcessedIcon {
  const sourceBytes = byteLength(icon.source);
  const base = { key: icon.key, id, origin: icon.origin, sourceBytes };
  const parsed = parseSvg(icon.source);
  if (!parsed.root) return { ...base, viewBox: FALLBACK_VIEWBOX, symbol: "", error: parsed.error, notes: [] };

  const root = parsed.root;
  const counts: CleanCounts = { unsafe: 0, handlers: 0, urls: 0, stylesheets: 0, dropped: 0, editorAttributes: 0 };
  cleanTree(root, counts);
  const notes = describeCleanCounts(counts);
  const viewBox = resolveViewBox(root, notes);
  const symbolId = `${idPrefix}${id}`;

  const { prefixed, removed } = prefixInternalIds(root, symbolId);
  if (prefixed) notes.push({ message: `Prefixed ${plural(prefixed, "internal id")} with “${id}__”`, tone: "info" });
  if (removed) notes.push({ message: `Dropped ${plural(removed, "unused id")}`, tone: "info" });
  if (currentColor) {
    const recoloured = applyCurrentColor(root);
    if (recoloured) notes.push({ message: `Swapped ${plural(recoloured, "colour")} for currentColor`, tone: "info" });
  }

  const kept = root.attributes.filter(([name]) => !ROOT_DROPPED_ATTRIBUTES.has(name));
  const symbol: SpriteElementNode = { kind: "element", name: "symbol", attributes: [["id", symbolId], ["viewBox", viewBox], ...kept], children: root.children };
  return { ...base, viewBox, symbol: serialiseNode(symbol, 1), error: null, notes };
}

/*
  Builds the whole sprite. It's hidden with zero size and absolute positioning rather than
  display: none, because Chrome and Firefox refuse to paint gradients and clip paths defined
  inside a display: none <svg> — exactly the internals this tool takes care to keep working.
*/
export function buildSprite(icons: SpriteIcon[], currentColor: boolean, { idPrefix }: SpriteBuildOptions): SpriteBuildResult {
  const ids = resolveIds(icons.map((icon) => icon.id));
  const processed = icons.map((icon, index) => processIcon(icon, ids[index], currentColor, idPrefix));
  const valid = processed.filter((icon) => !icon.error);
  const sprite =
    valid.length > 0
      ? `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="0" height="0" style="position: absolute; overflow: hidden">\n${valid.map((icon) => icon.symbol).join("\n")}\n</svg>\n`
      : "";
  return {
    icons: processed,
    sprite,
    spriteBytes: byteLength(sprite),
    separateBytes: valid.reduce((total, icon) => total + icon.sourceBytes, 0),
    validCount: valid.length
  };
}

// Snippet height follows the icon's own proportions, so a wide logo isn't squashed into a square.
function snippetHeight(viewBox: string): number {
  const [, , width, height] = viewBox.split(" ").map(Number);
  return width > 0 && height > 0 ? Math.round((SNIPPET_SIZE * height) / width) : SNIPPET_SIZE;
}

/*
  One <use> reference in the chosen flavour. Plain href rather than xlink:href, since every current
  browser supports it; the external form only works same-origin, which the cover's hint spells out.
*/
export function buildSnippet(icon: ProcessedIcon, flavour: SnippetFlavour, spritePath: string): string {
  const height = snippetHeight(icon.viewBox);
  if (flavour === "react") {
    return `<svg className="icon" width={${SNIPPET_SIZE}} height={${height}} aria-hidden="true">\n  <use href="#${icon.id}" />\n</svg>`;
  }
  const href = flavour === "external" ? `${spritePath}#${icon.id}` : `#${icon.id}`;
  return `<svg class="icon" width="${SNIPPET_SIZE}" height="${height}" aria-hidden="true">\n  <use href="${escapeXml(href)}"></use>\n</svg>`;
}

/*
  Recognises an existing sprite (an <svg> whose only element children are <symbol>s) and splits it
  back into one standalone icon per symbol, so a downloaded sprite can be dropped straight back in.
  The "id__" prefixes this tool added are peeled off, so re-importing doesn't double them up.
  Returns null for ordinary icons.
*/
export function splitSprite(source: string): Array<{ id: string; source: string }> | null {
  if (typeof DOMParser === "undefined" || typeof XMLSerializer === "undefined" || !/<symbol\b/.test(source)) return null;
  const doc = new DOMParser().parseFromString(source.trim(), "image/svg+xml");
  const root = doc.documentElement;
  if (!root || root.localName !== "svg" || doc.getElementsByTagName("parsererror").length > 0) return null;
  const symbols = Array.from(root.children);
  if (symbols.length === 0 || symbols.some((child) => child.localName !== "symbol")) return null;

  const serializer = new XMLSerializer();
  return symbols.map((symbol, index) => {
    const id = symbol.getAttribute("id") ?? `symbol-${index + 1}`;
    const attributes = Array.from(symbol.attributes)
      .filter((attribute) => attribute.name !== "id")
      .map((attribute) => ` ${attribute.name}="${escapeXml(attribute.value)}"`)
      .join("");
    const inner = Array.from(symbol.childNodes)
      .map((child) => serializer.serializeToString(child))
      .join("")
      .split(`${id}__`)
      .join("");
    return { id, source: `<svg xmlns="http://www.w3.org/2000/svg"${attributes}>${inner}</svg>` };
  });
}

// Picks a sensible id for pasted markup: its own root id, else its <title>, else the origin label.
export function suggestIdFromSource(source: string, fallback: string): string {
  const rootId = /<svg\b[^>]*\sid\s*=\s*["']([^"']+)["']/i.exec(source)?.[1];
  if (rootId) return rootId;
  const title = /<title[^>]*>([^<]+)<\/title>/i.exec(source)?.[1];
  return title ?? fallback;
}
