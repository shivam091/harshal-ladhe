import { parseSvg } from "@/utils/svg-to-react-parse";
import { emitComponent, parseStyleDeclarations, serialiseStyleDeclarations } from "@/utils/svg-to-react-jsx";
import type {
  CurrentColorMode,
  SanitiseCounts,
  SvgElementNode,
  SvgNode,
  SvgToReactEditorState,
  SvgToReactResult,
  TransformLogEntry
} from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// Elements that can run script or embed arbitrary HTML — removed from both the output and the previews, since pasted SVG is untrusted and the preview renders it into this page.
const UNSAFE_ELEMENTS = new Set(["script", "foreignObject", "iframe", "embed", "object", "handler", "listener"]);

// Pure editor bookkeeping with no rendering effect — Inkscape, Illustrator and Sketch all leave some of these behind.
const EDITOR_ELEMENTS = new Set(["metadata"]);

// Root-only attributes that editors emit by habit but which change nothing about an inline SVG's rendering.
const ROOT_CRUFT_ATTRIBUTES = new Set(["version", "baseProfile", "enable-background", "xml:space"]);

// Colour-bearing properties the currentColor transform rewrites — stop-color and flood-color are left alone, since flattening a gradient's stops into one tint destroys it.
const COLOUR_PROPERTIES = new Set(["fill", "stroke", "color"]);

// Keyword values that aren't a hard-coded colour and so must never be rewritten to currentColor.
const NON_COLOUR_VALUES = new Set(["none", "transparent", "currentcolor", "inherit", "initial", "unset", "revert", "context-fill", "context-stroke"]);

// Fallback component name when nothing usable can be derived from a file name.
const FALLBACK_COMPONENT_NAME = "SvgIcon";

// Deep copy so each transform run starts from the pristine parse — the previews and the output each mutate their own copy.
function cloneNode<T extends SvgNode>(node: T): T {
  if (node.kind !== "element") return { ...node };
  return { ...node, attributes: node.attributes.map(([name, value]) => [name, value]), children: node.children.map(cloneNode) } as T;
}

// Visits every element with its ancestor chain, so a transform can ask "am I inside a <mask>?" without each one re-implementing the walk.
function walkElements(node: SvgElementNode, visit: (element: SvgElementNode, ancestors: SvgElementNode[]) => void, ancestors: SvgElementNode[] = []): void {
  visit(node, ancestors);
  for (const child of node.children) {
    if (child.kind === "element") walkElements(child, visit, [...ancestors, node]);
  }
}

// Reads one attribute — trees keep attributes as ordered pairs, so lookups go through this rather than an index.
function getAttribute(node: SvgElementNode, name: string): string | undefined {
  return node.attributes.find(([attributeName]) => attributeName === name)?.[1];
}

// Sets (or appends) one attribute while keeping its original position, so rewritten attributes don't jump around in the output.
function setAttribute(node: SvgElementNode, name: string, value: string): void {
  const existing = node.attributes.find(([attributeName]) => attributeName === name);
  if (existing) existing[1] = value;
  else node.attributes.push([name, value]);
}

// Counts how many children a filter removed, so each transform can report a number in the log.
function removeChildren(node: SvgElementNode, shouldRemove: (child: SvgNode) => boolean): number {
  const before = node.children.length;
  node.children = node.children.filter((child) => !shouldRemove(child));
  return before - node.children.length;
}

// Strips control characters and whitespace before checking a URL's scheme — browsers ignore both, so "java\tscript:" must be caught too.
function isDangerousUrl(value: string): boolean {
  const normalised = value.replace(/[\u0000- ]/g, "").toLowerCase();
  return /^(?:javascript|vbscript):/.test(normalised) || normalised.startsWith("data:text/html");
}

/*
  Always-on safety pass: removes script-capable elements, inline event handlers, javascript:/
  vbscript: URLs (on any attribute, plus <set>/<animate> tricks that swap an href at runtime) and
  styles carrying script-y CSS. Applied to the output as well as the previews, so copying the
  component can never carry a payload into a codebase either.
*/
export function sanitiseTree(root: SvgElementNode): SanitiseCounts {
  const counts: SanitiseCounts = { elements: 0, handlers: 0, urls: 0 };
  walkElements(root, (element) => {
    counts.elements += removeChildren(element, (child) => {
      if (child.kind !== "element") return false;
      if (UNSAFE_ELEMENTS.has(child.name)) return true;
      const animatedAttribute = getAttribute(child, "attributeName")?.toLowerCase();
      return ["set", "animate"].includes(child.name) && (animatedAttribute === "href" || animatedAttribute === "xlink:href");
    });
    element.attributes = element.attributes.filter(([name, value]) => {
      if (/^on/i.test(name)) {
        counts.handlers++;
        return false;
      }
      if (isDangerousUrl(value) || (name === "style" && /javascript:|expression\s*\(/i.test(value))) {
        counts.urls++;
        return false;
      }
      return true;
    });
  });
  return counts;
}

// Gathers every id actually referenced (url(#…), href="#…", aria-* id lists), so unreferenced editor ids can go while gradient/clip/use targets survive.
function collectReferencedIds(root: SvgElementNode): Set<string> {
  const referenced = new Set<string>();
  walkElements(root, (element) => {
    for (const [name, value] of element.attributes) {
      for (const match of value.matchAll(/url\(\s*['"]?#([^'")\s]+)/g)) referenced.add(match[1]);
      if ((name === "href" || name === "xlink:href") && value.startsWith("#")) referenced.add(value.slice(1));
      if (name === "aria-labelledby" || name === "aria-describedby") value.split(/\s+/).forEach((id) => referenced.add(id));
    }
    // <style> sheets can target ids too (#logo-mark { … }), so those count as references as well.
    if (element.name === "style") {
      for (const child of element.children) {
        if (child.kind === "text") for (const match of child.value.matchAll(/#([A-Za-z_][\w-]*)/g)) referenced.add(match[1]);
      }
    }
  });
  return referenced;
}

// A <desc> that only says which tool made the file ("Created with Sketch.") describes the export, not the artwork — the same rule SVGO's removeDesc applies.
function isGeneratorDesc(node: SvgElementNode): boolean {
  return node.name === "desc" && node.children.every((child) => child.kind !== "text" || /^\s*(?:created with|generator:)/i.test(child.value));
}

// Which log bucket a cruft attribute falls into (null = keep it) — split out so the log can report Inkscape noise separately from namespace declarations and stray ids.
function classifyCruftAttribute(name: string, value: string, isRoot: boolean, referencedIds: Set<string>): "inkscape" | "xmlns" | "data-name" | "other" | "id" | null {
  if (name.startsWith("sodipodi:") || name.startsWith("inkscape:")) return "inkscape";
  if (name.startsWith("xmlns:")) return "xmlns";
  if (name === "data-name") return "data-name";
  if (name.includes(":") && !name.startsWith("xlink:") && !name.startsWith("xml:")) return "other";
  if (isRoot && (ROOT_CRUFT_ATTRIBUTES.has(name) || ((name === "x" || name === "y") && /^0(?:px)?$/.test(value)))) return "other";
  if (name === "id" && !referencedIds.has(value)) return "id";
  return null;
}

/*
  Removes everything an editor writes for its own benefit: comments, <metadata>, namespaced
  elements and attributes (sodipodi:, inkscape:, sketch:, serif:, i: …), xmlns:* declarations,
  data-name, root-level version/x/y/enable-background, unreferenced ids, and the empty <defs>/<g>
  shells left behind once their contents are gone. xlink: and xml: survive here — those are real
  SVG attributes that the camelCase step renames rather than drops.
*/
function stripCruft(root: SvgElementNode, hadProlog: boolean, log: TransformLogEntry[]): void {
  let comments = 0;
  let editorElements = 0;
  let inkscapeAttributes = 0;
  let namespaceDeclarations = 0;
  let dataNames = 0;
  let otherAttributes = 0;
  let emptyContainers = 0;

  walkElements(root, (element) => {
    comments += removeChildren(element, (child) => child.kind === "comment");
    editorElements += removeChildren(element, (child) => child.kind === "element" && (EDITOR_ELEMENTS.has(child.name) || child.name.includes(":") || isGeneratorDesc(child)));
  });

  const referencedIds = collectReferencedIds(root);
  let unreferencedIds = 0;

  walkElements(root, (element) => {
    const isRoot = element === root;
    element.attributes = element.attributes.filter(([name, value]) => {
      const category = classifyCruftAttribute(name, value, isRoot, referencedIds);
      if (category === "inkscape") inkscapeAttributes++;
      else if (category === "xmlns") namespaceDeclarations++;
      else if (category === "data-name") dataNames++;
      else if (category === "other") otherAttributes++;
      else if (category === "id") unreferencedIds++;
      return category === null;
    });

    // Illustrator hides enable-background inside the root's inline style too — drop just that declaration and the whole attribute if nothing else is left.
    const style = getAttribute(element, "style");
    if (style !== undefined) {
      const declarations = parseStyleDeclarations(style).filter(([property]) => property !== "enable-background");
      if (declarations.length === 0) element.attributes = element.attributes.filter(([name]) => name !== "style");
      else setAttribute(element, "style", serialiseStyleDeclarations(declarations));
      if (declarations.length !== parseStyleDeclarations(style).length) otherAttributes++;
    }
  });

  // Repeats until stable, since emptying an inner <g> can leave its parent <defs> empty in turn.
  let removedThisPass = 0;
  do {
    removedThisPass = 0;
    walkElements(root, (element) => {
      removedThisPass += removeChildren(
        element,
        (child) => child.kind === "element" && (child.name === "defs" || child.name === "g") && child.children.length === 0
      );
    });
    emptyContainers += removedThisPass;
  } while (removedThisPass > 0);

  const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;
  if (hadProlog) log.push({ id: "prolog", message: "Dropped the XML prolog / DOCTYPE", tone: "info" });
  if (comments) log.push({ id: "comments", message: `Removed ${plural(comments, "comment")}`, tone: "info" });
  if (editorElements) log.push({ id: "editor-elements", message: `Removed ${plural(editorElements, "editor element")} (metadata, sodipodi:namedview, …)`, tone: "info" });
  if (inkscapeAttributes) log.push({ id: "inkscape", message: `Removed ${plural(inkscapeAttributes, "Inkscape/Sodipodi attribute")}`, tone: "info" });
  if (namespaceDeclarations) log.push({ id: "xmlns", message: `Removed ${plural(namespaceDeclarations, "xmlns:* declaration")}`, tone: "info" });
  if (dataNames) log.push({ id: "data-name", message: `Removed ${plural(dataNames, "data-name attribute")}`, tone: "info" });
  if (otherAttributes) log.push({ id: "editor-attributes", message: `Removed ${plural(otherAttributes, "other editor attribute")} (version, x/y, enable-background, …)`, tone: "info" });
  if (unreferencedIds) log.push({ id: "ids", message: `Removed ${plural(unreferencedIds, "unreferenced id")}`, tone: "info" });
  if (emptyContainers) log.push({ id: "empty", message: `Removed ${plural(emptyContainers, "empty <g>/<defs> container")}`, tone: "info" });
}

/*
  Inlines simple class rules from <style> sheets (".cls-1{fill:#e44}" — Illustrator's default
  export) onto the matching elements as presentation attributes, then drops the sheet. Inline
  <style> inside an SVG leaks into the whole page once rendered in the DOM, so this is how
  multiple icons on one page avoid repainting each other's .cls-1. Only plain class selectors
  (optionally comma-grouped) are inlined; a sheet with anything fancier is left in place.
*/
export function inlineStyleSheets(root: SvgElementNode): { rules: number; sheetsKept: number } {
  const rules = new Map<string, Array<[string, string]>>();
  let sheetsKept = 0;
  let inlinedRules = 0;

  walkElements(root, (element) => {
    removeChildren(element, (child) => {
      if (child.kind !== "element" || child.name !== "style") return false;
      const css = child.children.map((text) => (text.kind === "text" ? text.value : "")).join("").replace(/\/\*[\s\S]*?\*\//g, "");
      const blocks = Array.from(css.matchAll(/([^{}]+)\{([^{}]*)\}/g));
      const leftover = css.replace(/([^{}]+)\{([^{}]*)\}/g, "").trim();
      const simple = leftover.length === 0 && blocks.every(([, selector]) => selector.split(",").every((part) => /^\s*\.[A-Za-z_][\w-]*\s*$/.test(part)));
      if (!simple) {
        sheetsKept++;
        return false;
      }
      for (const [, selector, body] of blocks) {
        inlinedRules++;
        for (const part of selector.split(",")) {
          const className = part.trim().slice(1);
          rules.set(className, [...(rules.get(className) ?? []), ...parseStyleDeclarations(body)]);
        }
      }
      return true;
    });
  });

  if (rules.size === 0) return { rules: 0, sheetsKept };

  walkElements(root, (element) => {
    const classAttribute = getAttribute(element, "class");
    if (!classAttribute) return;
    const remaining: string[] = [];
    for (const className of classAttribute.split(/\s+/).filter(Boolean)) {
      const declarations = rules.get(className);
      if (!declarations) {
        remaining.push(className);
        continue;
      }
      // An existing inline style still wins over a class rule in CSS, so only fill in properties the element doesn't already set.
      const inlineStyle = parseStyleDeclarations(getAttribute(element, "style") ?? "");
      for (const [property, value] of declarations) {
        if (!inlineStyle.some(([existing]) => existing === property)) setAttribute(element, property, value);
      }
    }
    if (remaining.length > 0) setAttribute(element, "class", remaining.join(" "));
    else element.attributes = element.attributes.filter(([name]) => name !== "class");
  });

  return { rules: inlinedRules, sheetsKept };
}

// Turns "24px" / "24" into a number; anything relative ("100%", "1em") can't seed a viewBox, so it comes back null.
function parseLength(value: string | undefined): number | null {
  if (!value) return null;
  const match = /^\s*([\d.]+)\s*(?:px)?\s*$/.exec(value);
  return match ? Number(match[1]) : null;
}

// The artwork's designed size — used as the size prop's default so <Icon /> with no props renders as the author drew it.
function intrinsicSize(root: SvgElementNode): number {
  const width = parseLength(getAttribute(root, "width"));
  if (width) return Math.round(width);
  const viewBox = getAttribute(root, "viewBox")?.trim().split(/[\s,]+/).map(Number);
  if (viewBox && viewBox.length === 4 && Number.isFinite(viewBox[2]) && viewBox[2] > 0) return Math.round(viewBox[2]);
  return 24;
}

// Drops width/height so the icon scales with its container or the size prop — synthesising a viewBox first when there isn't one, since removing dimensions without it would collapse the drawing.
function removeDimensions(root: SvgElementNode, log: TransformLogEntry[]): void {
  const width = getAttribute(root, "width");
  const height = getAttribute(root, "height");
  if (width === undefined && height === undefined) return;

  let viewBox = getAttribute(root, "viewBox");
  if (!viewBox) {
    const numericWidth = parseLength(width);
    const numericHeight = parseLength(height);
    if (numericWidth === null || numericHeight === null) {
      log.push({ id: "dimensions", message: "Kept width/height — there's no viewBox and the size isn't numeric, so removing them would collapse the drawing", tone: "warning" });
      return;
    }
    viewBox = `0 0 ${numericWidth} ${numericHeight}`;
    setAttribute(root, "viewBox", viewBox);
    log.push({ id: "viewbox", message: `Added viewBox="${viewBox}" from the original width/height`, tone: "info" });
  }

  root.attributes = root.attributes.filter(([name]) => name !== "width" && name !== "height");
  log.push({ id: "dimensions", message: `Removed width/height (${width ?? "auto"} × ${height ?? "auto"}), kept viewBox="${viewBox}"`, tone: "info" });
}

// Short hex and case differences are the same colour — normalised so "#FFF" and "#ffffff" count once.
function normaliseColour(value: string): string {
  const lower = value.trim().toLowerCase();
  const shortHex = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(lower);
  return shortHex ? `#${shortHex[1]}${shortHex[1]}${shortHex[2]}${shortHex[2]}${shortHex[3]}${shortHex[3]}` : lower;
}

// Only literal colours qualify — paint servers (url(#grad)), CSS variables and keywords like none are meaningful as written.
function isHardCodedColour(value: string): boolean {
  const lower = value.trim().toLowerCase();
  return lower.length > 0 && !NON_COLOUR_VALUES.has(lower) && !lower.startsWith("url(") && !lower.startsWith("var(");
}

// A surviving <style> sheet means colours may be hiding in CSS rules the attribute-level rewrite can't see.
function containsStyleSheet(root: SvgElementNode): boolean {
  let found = false;
  walkElements(root, (element) => {
    if (element.name === "style") found = true;
  });
  return found;
}

/*
  Rewrites hard-coded fill/stroke colours (attributes and inline style declarations) to
  currentColor so the icon follows the surrounding text colour. Anything inside <mask> or
  <clipPath> is skipped — a mask's white/black is luminance data, not paint, and tinting it would
  break the mask. In "single" mode a multi-colour drawing is left untouched with a warning instead.
*/
function applyCurrentColor(root: SvgElementNode, mode: CurrentColorMode, log: TransformLogEntry[]): void {
  if (mode === "off") return;

  const targets: Array<{ element: SvgElementNode; property: string; inStyle: boolean }> = [];
  const distinct = new Set<string>();

  walkElements(root, (element, ancestors) => {
    if (element.name === "mask" || element.name === "clipPath" || ancestors.some((ancestor) => ancestor.name === "mask" || ancestor.name === "clipPath")) return;
    for (const [name, value] of element.attributes) {
      if (COLOUR_PROPERTIES.has(name) && isHardCodedColour(value)) {
        targets.push({ element, property: name, inStyle: false });
        distinct.add(normaliseColour(value));
      }
    }
    for (const [property, value] of parseStyleDeclarations(getAttribute(element, "style") ?? "")) {
      if (COLOUR_PROPERTIES.has(property) && isHardCodedColour(value)) {
        targets.push({ element, property, inStyle: true });
        distinct.add(normaliseColour(value));
      }
    }
  });

  if (distinct.size === 0 && containsStyleSheet(root)) {
    log.push({ id: "current-color", message: "Colours set by a <style> sheet aren't rewritten — turn on \"Inline <style> classes\" first", tone: "warning" });
    return;
  }

  if (distinct.size === 0) {
    // No explicit colour at all means the browser's default black fill — giving the root fill="currentColor" makes that default follow the text colour too.
    if (getAttribute(root, "fill") === undefined) {
      setAttribute(root, "fill", "currentColor");
      log.push({ id: "current-color", message: 'No explicit colours — added fill="currentColor" to <svg> so the default black follows the text colour', tone: "info" });
    }
    return;
  }

  if (mode === "single" && distinct.size > 1) {
    log.push({ id: "current-color", message: `Kept ${distinct.size} colours as they are — "single colour" mode only rewrites one-colour icons`, tone: "warning" });
    return;
  }

  for (const { element, property, inStyle } of targets) {
    if (!inStyle) {
      setAttribute(element, property, "currentColor");
      continue;
    }
    const declarations = parseStyleDeclarations(getAttribute(element, "style") ?? "").map(
      ([name, value]): [string, string] => [name, name === property && isHardCodedColour(value) ? "currentColor" : value]
    );
    setAttribute(element, "style", serialiseStyleDeclarations(declarations));
  }

  const colourWord = distinct.size === 1 ? "colour" : "colours";
  log.push({ id: "current-color", message: `${distinct.size} ${colourWord} → currentColor (${targets.length} ${targets.length === 1 ? "value" : "values"} rewritten)`, tone: "info" });
}

// Counts the attribute renames the emitter will make, so the log reports camelCasing just as concretely as the tree-level transforms.
function logJsxRenames(root: SvgElementNode, log: TransformLogEntry[]): void {
  let hyphenated = 0;
  let namespaced = 0;
  let classNames = 0;
  let styles = 0;
  walkElements(root, (element) => {
    for (const [name] of element.attributes) {
      if (name === "class") classNames++;
      else if (name === "style") styles++;
      else if (name.includes(":")) namespaced++;
      else if (name.includes("-") && !name.startsWith("aria-") && !name.startsWith("data-")) hyphenated++;
    }
  });
  if (hyphenated) log.push({ id: "camel", message: `Camel-cased ${hyphenated} hyphenated attribute${hyphenated === 1 ? "" : "s"} (stroke-width → strokeWidth, …)`, tone: "info" });
  if (namespaced) log.push({ id: "namespaced", message: `Renamed ${namespaced} namespaced attribute${namespaced === 1 ? "" : "s"} (xlink:href → xlinkHref, …)`, tone: "info" });
  if (classNames) log.push({ id: "class", message: `class → className ×${classNames}`, tone: "info" });
  if (styles) log.push({ id: "style", message: `Converted ${styles} style string${styles === 1 ? "" : "s"} to style objects`, tone: "info" });
}

// File name → PascalCase identifier ("arrow-left.svg" → "ArrowLeft"); a leading digit gets a "Svg" prefix, since a component name can't start with one.
export function toComponentName(input: string): string {
  const base = input.replace(/\.svg$/i, "");
  const words = base.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length === 0) return FALLBACK_COMPONENT_NAME;
  const pascal = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join("");
  return /^\d/.test(pascal) ? `Svg${pascal}` : pascal;
}

// UTF-8 byte length — what the file actually weighs on disk, rather than JavaScript's UTF-16 string length.
function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

/*
  Runs the whole pipeline once per state change and returns everything every panel needs: both
  preview trees, the emitted code, the transforms log and the byte counts. The previews always get
  their <style> sheets inlined (even when that toggle is off for the output), since a sheet rendered
  into this page would restyle every other SVG on it.
*/
export function convertSvgToReact(state: SvgToReactEditorState): SvgToReactResult {
  const { options } = state;
  const parsed = parseSvg(state.source);
  const bytesBefore = byteLength(state.source);
  const empty: SvgToReactResult = { error: parsed.error, original: null, converted: null, code: "", log: [], componentName: FALLBACK_COMPONENT_NAME, bytesBefore, bytesAfter: 0 };
  if (!parsed.root) return empty;

  const log: TransformLogEntry[] = [];
  const tree = cloneNode(parsed.root);
  const defaultSize = intrinsicSize(tree);

  const sanitised = sanitiseTree(tree);
  if (sanitised.elements) log.push({ id: "unsafe-elements", message: `Removed ${sanitised.elements} unsafe element${sanitised.elements === 1 ? "" : "s"} (<script>, <foreignObject>, …)`, tone: "warning" });
  if (sanitised.handlers) log.push({ id: "handlers", message: `Removed ${sanitised.handlers} inline event handler${sanitised.handlers === 1 ? "" : "s"} (onclick, onload, …)`, tone: "warning" });
  if (sanitised.urls) log.push({ id: "urls", message: `Removed ${sanitised.urls} javascript: URL${sanitised.urls === 1 ? "" : "s"}`, tone: "warning" });

  if (options.stripCruft) stripCruft(tree, parsed.hadProlog, log);
  if (options.inlineStyles) {
    const inlined = inlineStyleSheets(tree);
    if (inlined.rules) log.push({ id: "inline-styles", message: `Inlined ${inlined.rules} <style> rule${inlined.rules === 1 ? "" : "s"} as attributes and removed the sheet`, tone: "info" });
    if (inlined.sheetsKept) log.push({ id: "inline-styles-kept", message: "Kept a <style> sheet with selectors beyond plain classes — it will apply page-wide", tone: "warning" });
  }
  if (options.removeDimensions) removeDimensions(tree, log);
  applyCurrentColor(tree, options.currentColor, log);

  if (options.titleProp && !options.reactNative) {
    const replaced = removeChildren(tree, (child) => child.kind === "element" && child.name === "title");
    if (replaced) log.push({ id: "title", message: "Replaced the static <title> with the title prop", tone: "info" });
  }

  if (options.camelCaseProps) logJsxRenames(tree, log);
  else log.push({ id: "camel-off", message: "Kept raw attribute names — React will warn about class, stroke-width and style strings", tone: "warning" });

  const componentName = toComponentName(state.componentName || state.fileName);
  if (state.componentName && componentName !== state.componentName) {
    log.push({ id: "name", message: `Adjusted the component name to ${componentName} so it's a valid PascalCase identifier`, tone: "warning" });
  }

  if (options.spreadProps) log.push({ id: "spread", message: "Spread {...props} onto the root <svg>", tone: "info" });
  if (options.titleProp && !options.reactNative) log.push({ id: "title-prop", message: "Added a title prop wired to <title> + aria-labelledby (useId)", tone: "info" });
  if (options.sizeProp) log.push({ id: "size", message: `Added a size prop (default ${defaultSize}) mapped to width/height`, tone: "info" });
  if (options.forwardRef) log.push({ id: "ref", message: "Forwarded ref as a plain prop (React 19)", tone: "info" });
  if (options.memo) log.push({ id: "memo", message: "Wrapped the component in memo", tone: "info" });
  if (options.reactNative) log.push({ id: "native", message: "Mapped elements to react-native-svg components (title/desc/style dropped)", tone: "info" });

  const code = emitComponent(tree, componentName, options, defaultSize);

  const original = cloneNode(parsed.root);
  sanitiseTree(original);
  inlineStyleSheets(original);
  const converted = cloneNode(tree);
  inlineStyleSheets(converted);

  return { error: null, original, converted, code, log, componentName, bytesBefore, bytesAfter: byteLength(code) };
}
