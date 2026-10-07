import type {
  DiffLine,
  DiffRow,
  OptAttribute,
  OptDocument,
  OptElement,
  OptNode,
  OptOuterNode,
  OptimiseResult,
  ParseResult,
  PassContext,
  PassFunction,
  PassId,
  PassMeta,
  PassReport,
  PathSegment,
  SanitiseCounts,
  SvgOptimiserEditorState
} from "@/components/SvgOptimiser/SvgOptimiser.types";

/* ───────────────────────────── Pass catalogue ───────────────────────────── */

/*
  Every pass in the order it runs. Order matters: ids are dropped before groups are collapsed (an
  id is what usually keeps a group alive), and whitespace goes last so every earlier pass is
  measured against the same indented layout.
*/
export const PASS_META: PassMeta[] = [
  { id: "stripProlog", label: "Strip XML prolog & doctype", hint: "<?xml …?>, <!DOCTYPE> and processing instructions — browsers don't need them.", defaultOn: true },
  { id: "stripComments", label: "Remove comments", hint: "Licence comments written as <!--! … --> are kept.", defaultOn: true },
  { id: "stripMetadata", label: "Remove editor metadata", hint: "<metadata>, Inkscape/Sodipodi/Sketch/Illustrator/Figma namespaces and unused xmlns declarations.", defaultOn: true },
  { id: "removeEmptyAttrs", label: "Drop empty attributes", hint: "class=\"\", style=\"\" and friends.", defaultOn: true },
  { id: "removeUnusedIds", label: "Drop unreferenced ids", hint: "Ids nothing points at via url(#…), href or a stylesheet. Ids on <symbol> and <svg> stay for sprites.", defaultOn: true },
  { id: "removeDefaults", label: "Remove default values", hint: "stroke=\"none\", opacity=\"1\", x=\"0\" and values an element would inherit anyway.", defaultOn: true },
  { id: "removeEmptyContainers", label: "Remove empty groups", hint: "<g>, <defs> and friends with nothing inside.", defaultOn: true },
  { id: "collapseGroups", label: "Collapse useless groups", hint: "Unwraps attribute-less <g>s and pushes a single-child group's attributes down onto the child.", defaultOn: true },
  { id: "roundNumbers", label: "Round numbers", hint: "To the precision below; opacities and offsets keep at least three places.", defaultOn: true },
  { id: "shortenColours", label: "Shorten colours", hint: "#ffffff → #fff, rgb() → hex, names ↔ hex — whichever is shorter.", defaultOn: true },
  { id: "shapesToPaths", label: "Shapes to paths", hint: "<rect>, <line>, <polyline> and <polygon> become a <path> when that's shorter.", defaultOn: true },
  { id: "minifyPaths", label: "Minify path data", hint: "Absolute or relative per segment, H/V for straight runs, repeated commands merged, no spare spaces or leading zeros.", defaultOn: true },
  { id: "removeDimensions", label: "Remove width/height", hint: "Leaves the viewBox in charge, so the SVG scales to its container. Off by default as it changes intrinsic size.", defaultOn: false },
  { id: "sortAttrs", label: "Sort & dedupe attributes", hint: "A canonical order helps gzip; attributes a style declaration overrides are dropped.", defaultOn: true },
  { id: "collapseWhitespace", label: "Collapse whitespace", hint: "Indentation and line breaks between tags, and runs of spaces inside values.", defaultOn: true }
];

/* ──────────────────────────────── Bytes ──────────────────────────────── */

// One shared encoder — sizes are reported in UTF-8 bytes, which is what actually goes over the wire, not UTF-16 string length.
const ENCODER = new TextEncoder();

// UTF-8 byte length of a string.
export function byteLength(text: string): number {
  return ENCODER.encode(text).length;
}

// Bytes in a readable unit — most icons sit under a few kilobytes, so one decimal place is plenty.
export function formatBytes(bytes: number): string {
  const sign = bytes < 0 ? "−" : "";
  const abs = Math.abs(bytes);
  return abs < 1024 ? `${sign}${abs} B` : `${sign}${(abs / 1024).toFixed(1)} kB`;
}

// Share of the original removed, to one decimal place — zero for an empty original rather than NaN.
export function percentSaved(before: number, after: number): number {
  return before > 0 ? Math.round(((before - after) / before) * 1000) / 10 : 0;
}

// gzip size via the browser's own CompressionStream, so the estimate costs no dependency; null where the API is missing.
export async function gzipSize(text: string): Promise<number | null> {
  if (typeof CompressionStream === "undefined") return null;
  try {
    const stream = new Blob([text]).stream().pipeThrough(new CompressionStream("gzip"));
    const buffer = await new Response(stream).arrayBuffer();
    return buffer.byteLength;
  } catch {
    return null;
  }
}

/* ──────────────────────────────── Files ──────────────────────────────── */

// Big enough for any real illustration, small enough that a mis-dropped photo can't freeze the tab while every pass re-serialises it.
export const MAX_FILE_BYTES = 2 * 1024 * 1024;

// Accepts by extension as well as MIME type, since some operating systems hand over .svg files with an empty or generic type.
export function isSvgFile(file: File): boolean {
  return file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
}

// "logo.svg" → "logo.min.svg", so the optimised file sits beside the original rather than overwriting it.
export function optimisedFileName(fileName: string): string {
  const base = fileName.replace(/\.svg$/i, "").trim() || "optimised";
  return `${base}.min.svg`;
}

// Hands the markup over as a real file via a temporary object URL, revoked straight after so repeated downloads don't leak blobs.
export function downloadText(fileName: string, contents: string, type = "image/svg+xml;charset=utf-8") {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

/* ──────────────────────────────── Parsing ──────────────────────────────── */

// DOM nodeType constants spelled out locally — the Node global doesn't exist during server rendering, and the values are fixed by the spec.
const NODE_TYPE = { element: 1, text: 3, cdata: 4, instruction: 7, comment: 8, doctype: 10 } as const;

// Firefox reports XML errors in a namespaced <parsererror> rather than Chrome's plain one, so both lookups are needed.
const MOZ_PARSER_ERROR_NS = "http://www.mozilla.org/newlayout/xml/parsererror.xml";

// The namespace xmlns declarations live in, so they can be told apart from ordinary attributes.
const XMLNS_NS = "http://www.w3.org/2000/xmlns/";

// The <?xml …?> declaration never becomes a DOM node, so it's sniffed from the raw text instead.
const DECLARATION_RE = /^﻿?\s*(<\?xml[\s\S]*?\?>)/;

// Browsers wrap the actual XML error in boilerplate — strip it so the message reads as one clear sentence.
function describeParserError(errorElement: Element): string {
  const detail = errorElement.querySelector("div")?.textContent ?? errorElement.textContent ?? "";
  const sourceExcerpt = errorElement.querySelector("sourcetext")?.textContent ?? "";
  const cleaned = detail
    .replace(sourceExcerpt, "")
    .replace(/This page contains the following errors:/i, "")
    .replace(/Below is a rendering of the page up to the first error\.?/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 0 ? `Invalid SVG markup — ${cleaned}` : "Invalid SVG markup — the XML parser couldn't read it.";
}

// Copies a live DOM element into a plain tree the passes own, keeping formatting whitespace so its removal can be measured.
function toOptElement(element: Element): OptElement {
  const children: OptNode[] = [];
  element.childNodes.forEach((child) => {
    if (child.nodeType === NODE_TYPE.element) children.push(toOptElement(child as Element));
    else if (child.nodeType === NODE_TYPE.text) children.push({ kind: "text", value: child.nodeValue ?? "" });
    else if (child.nodeType === NODE_TYPE.cdata) children.push({ kind: "cdata", value: child.nodeValue ?? "" });
    else if (child.nodeType === NODE_TYPE.comment) children.push({ kind: "comment", value: child.nodeValue ?? "" });
  });
  return {
    kind: "element",
    name: element.nodeName,
    ns: element.namespaceURI,
    attributes: Array.from(element.attributes).map((attribute) => ({ name: attribute.name, value: attribute.value, ns: attribute.namespaceURI })),
    children
  };
}

// Rebuilds a doctype's text from its parsed parts — the internal subset is dropped, but the parser has already expanded any entities it declared.
function doctypeText(node: DocumentType): string {
  if (node.publicId) return `<!DOCTYPE ${node.name} PUBLIC "${node.publicId}" "${node.systemId}">`;
  if (node.systemId) return `<!DOCTYPE ${node.name} SYSTEM "${node.systemId}">`;
  return `<!DOCTYPE ${node.name}>`;
}

/*
  Parses with the browser's XML parser (image/svg+xml, so an unclosed tag is a hard error rather
  than HTML's silent recovery) and copies the result into a plain document the passes can rewrite
  without touching live DOM.
*/
export function parseSvg(source: string): ParseResult {
  const trimmed = source.trim();
  if (trimmed.length === 0) return { doc: null, error: "Nothing on the scale yet — paste, drop or upload an SVG." };
  if (typeof DOMParser === "undefined") return { doc: null, error: "SVG parsing needs a browser — reload the page with JavaScript enabled." };

  const parsed = new DOMParser().parseFromString(trimmed, "image/svg+xml");
  const errorElement = parsed.getElementsByTagName("parsererror")[0] ?? parsed.getElementsByTagNameNS(MOZ_PARSER_ERROR_NS, "parsererror")[0];
  if (errorElement) return { doc: null, error: describeParserError(errorElement) };

  const rootElement = parsed.documentElement;
  if (!rootElement || rootElement.localName !== "svg") {
    return { doc: null, error: `Expected an <svg> root element but found <${rootElement?.nodeName ?? "nothing"}>.` };
  }

  const before: OptOuterNode[] = [];
  const after: OptOuterNode[] = [];
  let seenRoot = false;
  parsed.childNodes.forEach((node) => {
    const list = seenRoot ? after : before;
    if (node === rootElement) seenRoot = true;
    else if (node.nodeType === NODE_TYPE.doctype) list.push({ kind: "doctype", value: doctypeText(node as DocumentType) });
    else if (node.nodeType === NODE_TYPE.instruction) {
      const instruction = node as ProcessingInstruction;
      list.push({ kind: "instruction", value: `<?${instruction.target} ${instruction.data}?>` });
    } else if (node.nodeType === NODE_TYPE.comment) list.push({ kind: "comment", value: node.nodeValue ?? "" });
  });

  return {
    doc: { declaration: DECLARATION_RE.exec(trimmed)?.[1] ?? null, before, root: toOptElement(rootElement), after, separator: "\n" },
    error: null
  };
}

/* ──────────────────────────────── Serialising ──────────────────────────────── */

// Only & and < must be escaped in text; leaving > alone keeps a <style> sheet's child selectors readable and short.
function escapeText(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}

// Attribute values are always double-quoted, so " is the only quote that needs escaping.
function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

// The opening tag's name-and-attributes run, shared by the compact and pretty serialisers.
function openTag(element: OptElement): string {
  return `<${element.name}${element.attributes.map((attribute) => ` ${attribute.name}="${escapeAttribute(attribute.value)}"`).join("")}`;
}

// Compact serialisation — whatever whitespace is still in the tree is emitted verbatim, so the whitespace pass is what removes it.
function serialiseNode(node: OptNode): string {
  if (node.kind === "text") return escapeText(node.value);
  if (node.kind === "cdata") return `<![CDATA[${node.value}]]>`;
  if (node.kind === "comment") return `<!--${node.value}-->`;
  if (node.children.length === 0) return `${openTag(node)}/>`;
  return `${openTag(node)}>${node.children.map(serialiseNode).join("")}</${node.name}>`;
}

// Text form of a node outside the root element.
function serialiseOuter(node: OptOuterNode): string {
  return node.kind === "comment" ? `<!--${node.value}-->` : node.value;
}

// The whole document as it would be saved.
export function serialiseDocument(doc: OptDocument): string {
  const parts = [doc.declaration ?? "", ...doc.before.map(serialiseOuter), serialiseNode(doc.root), ...doc.after.map(serialiseOuter)].filter((part) => part.length > 0);
  return parts.join(doc.separator);
}

// Elements whose text content is the point, so the pretty view keeps it on the tag's own line.
const TEXT_BEARING = new Set(["text", "tspan", "textPath", "title", "desc", "style", "script"]);

// One element per line for the diff — indentation is two spaces per level regardless of the source's own layout.
function prettyElement(element: OptElement, depth: number, lines: string[]) {
  const indent = "  ".repeat(depth);
  const children = element.children.filter((child) => !(child.kind === "text" && child.value.trim() === ""));
  if (children.length === 0) {
    lines.push(`${indent}${openTag(element)}/>`);
    return;
  }
  if (children.every((child) => child.kind === "text" || child.kind === "cdata") || TEXT_BEARING.has(localName(element.name))) {
    lines.push(`${indent}${openTag(element)}>${children.map(serialiseNode).join("").replace(/\s+/g, " ").trim()}</${element.name}>`);
    return;
  }
  lines.push(`${indent}${openTag(element)}>`);
  for (const child of children) {
    if (child.kind === "element") prettyElement(child, depth + 1, lines);
    else lines.push(`${indent}  ${serialiseNode(child).replace(/\s+/g, " ").trim()}`);
  }
  lines.push(`${indent}</${element.name}>`);
}

// The document laid out one element per line, so a diff of two versions lines up by structure.
export function prettyPrint(doc: OptDocument): string {
  const lines: string[] = [];
  if (doc.declaration) lines.push(doc.declaration);
  doc.before.forEach((node) => lines.push(serialiseOuter(node)));
  prettyElement(doc.root, 0, lines);
  doc.after.forEach((node) => lines.push(serialiseOuter(node)));
  return lines.join("\n");
}

/* ──────────────────────────────── Tree helpers ──────────────────────────────── */

// Drops the prefix from a qualified name — element checks care about "metadata", not "svg:metadata".
function localName(name: string): string {
  const colon = name.indexOf(":");
  return colon === -1 ? name : name.slice(colon + 1);
}

// Reads an attribute by its qualified name.
function getAttr(element: OptElement, name: string): string | undefined {
  return element.attributes.find((attribute) => attribute.name === name)?.value;
}

// Replaces or appends an attribute, keeping its position when it already exists.
function setAttr(element: OptElement, name: string, value: string) {
  const existing = element.attributes.find((attribute) => attribute.name === name);
  if (existing) existing.value = value;
  else element.attributes.push({ name, value, ns: null });
}

// Removes every attribute the predicate matches.
function removeAttrs(element: OptElement, predicate: (attribute: OptAttribute) => boolean) {
  element.attributes = element.attributes.filter((attribute) => !predicate(attribute));
}

// Visits every element depth-first, parents before children.
function walk(element: OptElement, visit: (element: OptElement) => void) {
  visit(element);
  for (const child of element.children) if (child.kind === "element") walk(child, visit);
}

// Visits every element children-first, so a parent sees its children already cleaned — what the "is it empty now?" passes need.
function walkPost(element: OptElement, visit: (element: OptElement) => void) {
  for (const child of element.children) if (child.kind === "element") walkPost(child, visit);
  visit(element);
}

// Parses an inline style attribute into ordered declarations; malformed fragments are dropped rather than guessed at.
function parseStyle(style: string): Array<[string, string]> {
  return style
    .split(";")
    .map((declaration) => {
      const colon = declaration.indexOf(":");
      return colon === -1 ? null : ([declaration.slice(0, colon).trim().toLowerCase(), declaration.slice(colon + 1).trim()] as [string, string]);
    })
    .filter((pair): pair is [string, string] => pair !== null && pair[0].length > 0 && pair[1].length > 0);
}

// Writes declarations back in the tightest form CSS allows.
function stringifyStyle(declarations: Array<[string, string]>): string {
  return declarations.map(([property, value]) => `${property}:${value}`).join(";");
}

// Whether the file carries a stylesheet — several passes back off when one exists, since a selector could target what they'd rewrite.
function hasStylesheet(doc: OptDocument): boolean {
  let found = false;
  walk(doc.root, (element) => {
    if (localName(element.name) === "style") found = true;
  });
  return found;
}

// All text inside <style> and <script>, so ids mentioned there count as referenced.
function scriptAndStyleText(doc: OptDocument): string {
  let text = "";
  walk(doc.root, (element) => {
    const name = localName(element.name);
    if (name !== "style" && name !== "script") return;
    for (const child of element.children) if (child.kind === "text" || child.kind === "cdata") text += child.value;
  });
  return text;
}

// Every id something points at — url(#id), href="#id", aria references and animation sync bases like "intro.end".
function referencedIds(doc: OptDocument): Set<string> {
  const ids = new Set<string>();
  walk(doc.root, (element) => {
    for (const { name, value } of element.attributes) {
      for (const match of value.matchAll(/url\(\s*['"]?#([^'")\s]+)/g)) ids.add(match[1]);
      if ((name === "href" || name.endsWith(":href")) && value.startsWith("#")) ids.add(value.slice(1));
      if (name === "aria-labelledby" || name === "aria-describedby" || name === "aria-controls") value.split(/\s+/).forEach((id) => ids.add(id));
      if (name === "begin" || name === "end") for (const match of value.matchAll(/([A-Za-z_][\w-]*)\./g)) ids.add(match[1]);
    }
  });
  return ids;
}

/* ──────────────────────────────── Numbers ──────────────────────────────── */

// An SVG number: optional sign, digits with an optional fraction (or a bare fraction), optional exponent.
const NUMBER_SOURCE = "[+-]?(?:\\d+\\.?\\d*|\\.\\d+)(?:[eE][+-]?\\d+)?";

// Rounds to a number of decimal places.
function roundTo(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

// Wipes binary floating-point noise (0.1 + 0.2) out of computed differences without touching any precision the author actually wrote.
function clean(value: number): number {
  const rounded = Math.round(value * 1e10) / 1e10;
  return Object.is(rounded, -0) ? 0 : rounded;
}

// The shortest faithful spelling of a number: no leading zero before the point, no trailing zeros after it.
function compactNumber(value: number): string {
  const text = String(clean(value));
  if (text.startsWith("0.")) return text.slice(1);
  if (text.startsWith("-0.")) return `-${text.slice(2)}`;
  return text;
}

// Two numbers can sit flush when the second starts with a minus sign, or with a point and the first already has one.
function needsSeparator(previous: string, next: string): boolean {
  if (next.startsWith("-")) return false;
  if (next.startsWith(".") && previous.includes(".") && !/e/i.test(previous)) return false;
  return true;
}

// Joins numbers with a space only where the parser would otherwise misread them.
function joinNumbers(numbers: string[]): string {
  let out = "";
  numbers.forEach((number, index) => {
    if (index > 0 && needsSeparator(numbers[index - 1], number)) out += " ";
    out += number;
  });
  return out;
}

/*
  Rewrites every number in a value through `map` while keeping the author's separators — except
  where two numbers were flush and the rewritten pair would now merge, where a space is added.
*/
function mapNumbers(value: string, map: (value: number) => string): string {
  let out = "";
  let last = 0;
  let previous: string | null = null;
  for (const match of value.matchAll(new RegExp(NUMBER_SOURCE, "g"))) {
    const index = match.index ?? 0;
    const gap = value.slice(last, index);
    const next = map(parseFloat(match[0]));
    if (gap === "" && previous !== null && needsSeparator(previous, next)) out += " ";
    out += gap + next;
    previous = next;
    last = index + match[0].length;
  }
  return out + value.slice(last);
}

/* ──────────────────────────────── Path data ──────────────────────────────── */

// Arguments each path command takes per repetition.
const PATH_ARG_COUNTS: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };

/*
  Parses path data into one segment per drawn command, with implicit repeats made explicit (and the
  pairs after a moveto turned into linetos, as the spec says). Returns null on anything malformed,
  so callers leave a path they can't read exactly as it was.
*/
export function parsePath(d: string): PathSegment[] | null {
  const numberRe = new RegExp(NUMBER_SOURCE, "y");
  const segments: PathSegment[] = [];
  let index = 0;
  let command: string | null = null;

  const skipSeparators = () => {
    while (index < d.length && /[\s,]/.test(d[index])) index++;
  };
  const readNumber = (): number | null => {
    skipSeparators();
    numberRe.lastIndex = index;
    const match = numberRe.exec(d);
    if (!match) return null;
    index = numberRe.lastIndex;
    return parseFloat(match[0]);
  };
  const readFlag = (): number | null => {
    skipSeparators();
    const flag = d[index];
    if (flag !== "0" && flag !== "1") return null;
    index++;
    return flag === "1" ? 1 : 0;
  };
  const readGroup = (letter: string): boolean => {
    const lower = letter.toLowerCase();
    const args: number[] = [];
    for (let k = 0; k < PATH_ARG_COUNTS[lower]; k++) {
      const value = lower === "a" && (k === 3 || k === 4) ? readFlag() : readNumber();
      if (value === null) return false;
      args.push(value);
    }
    segments.push({ command: letter, args });
    return true;
  };

  skipSeparators();
  while (index < d.length) {
    const char = d[index];
    if (/[a-zA-Z]/.test(char)) {
      const lower = char.toLowerCase();
      if (!(lower in PATH_ARG_COUNTS)) return null;
      index++;
      if (lower === "z") {
        segments.push({ command: char, args: [] });
        command = null;
      } else {
        if (!readGroup(char)) return null;
        command = char === "m" ? "l" : char === "M" ? "L" : char;
      }
    } else {
      if (command === null) return null;
      if (!readGroup(command)) return null;
    }
    skipSeparators();
  }
  return segments.length > 0 && segments[0].command.toLowerCase() === "m" ? segments : null;
}

// Offsets an absolute argument list to be relative to the current point — only coordinate arguments move; arc radii, rotation and flags stay put.
function toRelativeArgs(kind: string, args: number[], cx: number, cy: number): number[] {
  if (kind === "H") return [clean(args[0] - cx)];
  if (kind === "V") return [clean(args[0] - cy)];
  if (kind === "A") return [...args.slice(0, 5), clean(args[5] - cx), clean(args[6] - cy)];
  return args.map((value, k) => clean(value - (k % 2 === 0 ? cx : cy)));
}

/*
  Emits segments in their shortest form: for each one, absolute and relative spellings are both
  tried (with L folded into H or V when the line is straight), the command letter is dropped when
  it simply repeats the previous one, and numbers are joined with as few separators as the grammar
  allows. Coordinates are worked out in absolute space throughout, so relative output never
  accumulates rounding drift.
*/
export function emitPath(segments: PathSegment[]): string {
  let out = "";
  let lastNumber: string | null = null;
  let repeatLetter: string | null = null;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;

  const render = (letter: string, numbers: string[], omit: boolean): string => {
    let text = omit ? "" : letter;
    let previous = omit ? lastNumber : null;
    for (const number of numbers) {
      if (previous !== null && needsSeparator(previous, number)) text += " ";
      text += number;
      previous = number;
    }
    return text;
  };

  segments.forEach((segment, index) => {
    const upper = segment.command.toUpperCase();
    const relative = segment.command !== upper;
    const ox = relative ? cx : 0;
    const oy = relative ? cy : 0;
    const a = segment.args;

    if (upper === "Z") {
      out += "z";
      lastNumber = null;
      repeatLetter = null;
      cx = sx;
      cy = sy;
      return;
    }

    let kind = upper;
    let abs: number[];
    if (upper === "H") abs = [clean(a[0] + ox)];
    else if (upper === "V") abs = [clean(a[0] + oy)];
    else if (upper === "A") abs = [a[0], a[1], a[2], a[3], a[4], clean(a[5] + ox), clean(a[6] + oy)];
    else abs = a.map((value, k) => clean(value + (k % 2 === 0 ? ox : oy)));

    if (kind === "L" && index > 0) {
      if (abs[1] === cy && abs[0] !== cx) {
        kind = "H";
        abs = [abs[0]];
      } else if (abs[0] === cx && abs[1] !== cy) {
        kind = "V";
        abs = [abs[1]];
      }
    }

    const format = (numbers: number[]) => numbers.map((value, k) => (kind === "A" && (k === 3 || k === 4) ? (value ? "1" : "0") : compactNumber(value)));
    const absLetter = kind;
    const relLetter = kind.toLowerCase();
    const absText = render(absLetter, format(abs), kind !== "M" && repeatLetter === absLetter);
    const relText = index === 0 ? absText : render(relLetter, format(toRelativeArgs(kind, abs, cx, cy)), kind !== "M" && repeatLetter === relLetter);
    const useRelative = relText.length < absText.length;
    const chosenLetter = useRelative ? relLetter : absLetter;
    const chosenNumbers = useRelative ? format(toRelativeArgs(kind, abs, cx, cy)) : format(abs);

    out += useRelative ? relText : absText;
    lastNumber = chosenNumbers[chosenNumbers.length - 1] ?? null;
    repeatLetter = chosenLetter === "M" ? "L" : chosenLetter === "m" ? "l" : chosenLetter;

    if (kind === "H") cx = abs[0];
    else if (kind === "V") cy = abs[0];
    else {
      cx = abs[abs.length - 2];
      cy = abs[abs.length - 1];
    }
    if (kind === "M") {
      sx = cx;
      sy = cy;
    }
  });

  return out;
}

// Shortest spelling of a path's data, or null when the data can't be parsed (so the caller keeps the original).
export function minifyPathData(d: string): string | null {
  const segments = parsePath(d);
  return segments ? emitPath(segments) : null;
}

// Rounds a path's numbers; arcs go through the full parser so their 0/1 flags are never mistaken for coordinates.
function roundPathData(d: string, places: number): string {
  if (!/[aA]/.test(d)) return mapNumbers(d, (value) => compactNumber(roundTo(value, places)));
  const segments = parsePath(d);
  if (!segments) return d;
  return segments
    .map(({ command, args }) => {
      const isArc = command.toLowerCase() === "a";
      return command + joinNumbers(args.map((value, k) => (isArc && (k === 3 || k === 4) ? String(value) : compactNumber(roundTo(value, places)))));
    })
    .join("");
}

/* ──────────────────────────────── Colours ──────────────────────────────── */

// Attributes and style properties whose value is a colour.
const COLOUR_PROPERTIES = new Set(["fill", "stroke", "stop-color", "flood-color", "lighting-color", "color"]);

// Named colours whose hex spelling is shorter.
const NAME_TO_HEX: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
  yellow: "#ffff00",
  fuchsia: "#ff00ff",
  magenta: "#ff00ff",
  aqua: "#00ffff",
  cyan: "#00ffff",
  lightgray: "#d3d3d3",
  lightgrey: "#d3d3d3",
  darkgray: "#a9a9a9",
  darkgrey: "#a9a9a9",
  whitesmoke: "#f5f5f5",
  gainsboro: "#dcdcdc",
  cornflowerblue: "#6495ed",
  steelblue: "#4682b4",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  lightsteelblue: "#b0c4de",
  mediumseagreen: "#3cb371"
};

// Hex colours with a shorter CSS name.
const HEX_TO_NAME: Record<string, string> = {
  "#ff0000": "red",
  "#c0c0c0": "silver",
  "#808080": "gray",
  "#800000": "maroon",
  "#008000": "green",
  "#808000": "olive",
  "#000080": "navy",
  "#800080": "purple",
  "#008080": "teal",
  "#ffa500": "orange",
  "#d2b48c": "tan",
  "#ffc0cb": "pink",
  "#a52a2a": "brown",
  "#f5deb3": "wheat",
  "#ff7f50": "coral",
  "#4b0082": "indigo",
  "#ee82ee": "violet",
  "#dda0dd": "plum",
  "#f0e68c": "khaki",
  "#fffff0": "ivory",
  "#faf0e6": "linen",
  "#ffe4c4": "bisque",
  "#f5f5dc": "beige",
  "#f0ffff": "azure",
  "#fffafa": "snow",
  "#ff6347": "tomato",
  "#da70d6": "orchid",
  "#cd853f": "peru",
  "#a0522d": "sienna",
  "#ffd700": "gold",
  "#fa8072": "salmon"
};

// rgb()/rgba() with an opaque alpha → six-digit hex; null for anything translucent or malformed, which has to stay as written.
function rgbToHex(value: string): string | null {
  const match = /^rgba?\(\s*([^)]*)\)$/i.exec(value);
  if (!match) return null;
  const parts = match[1].split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3 || parts.length > 4) return null;
  if (parts.length === 4 && !(parts[3] === "1" || parts[3] === "100%")) return null;
  const channels = parts.slice(0, 3).map((part) => (part.endsWith("%") ? Math.round(parseFloat(part) * 2.55) : Math.round(parseFloat(part))));
  if (channels.some((channel) => !Number.isFinite(channel) || channel < 0 || channel > 255)) return null;
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

// The shortest equivalent spelling of a colour, never longer than what was written; anything unrecognised comes back untouched.
export function shortenColour(value: string): string {
  const original = value.trim();
  let colour = original.toLowerCase();
  if (NAME_TO_HEX[colour]) colour = NAME_TO_HEX[colour];
  colour = rgbToHex(colour) ?? colour;
  if (!/^#[0-9a-f]{3}$|^#[0-9a-f]{6}$/.test(colour)) return value;

  const six = colour.length === 4 ? `#${colour[1]}${colour[1]}${colour[2]}${colour[2]}${colour[3]}${colour[3]}` : colour;
  let shortest = six[1] === six[2] && six[3] === six[4] && six[5] === six[6] ? `#${six[1]}${six[3]}${six[5]}` : six;
  const name = HEX_TO_NAME[six];
  if (name && name.length < shortest.length) shortest = name;
  return shortest.length <= original.length ? shortest : value;
}

/* ──────────────────────────────── Pass helpers ──────────────────────────────── */

// Namespaces only design tools read — anything in them is safe to drop from a file meant for browsers.
const EDITOR_NAMESPACES = new Set([
  "http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd",
  "http://inkscape.sourceforge.net/DTD/sodipodi-0.dtd",
  "http://www.inkscape.org/namespaces/inkscape",
  "http://www.bohemiancoding.com/sketch/ns",
  "http://ns.adobe.com/AdobeIllustrator/10.0/",
  "http://ns.adobe.com/Graphs/1.0/",
  "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/",
  "http://ns.adobe.com/AdobeSVGViewerExtensions/3.0",
  "http://ns.adobe.com/Variables/1.0/",
  "http://ns.adobe.com/SaveForWeb/1.0/",
  "http://ns.adobe.com/Extensibility/1.0/",
  "http://ns.adobe.com/Flows/1.0/",
  "http://ns.adobe.com/ImageReplacement/1.0/",
  "http://ns.adobe.com/GenericCustomNamespace/1.0/",
  "http://ns.adobe.com/XPath/1.0/",
  "http://schemas.microsoft.com/visio/2003/SVGExtensions/",
  "http://taptrix.com/vectorillustrator/svg_extensions",
  "http://www.figma.com/figma/ns",
  "http://purl.org/dc/elements/1.1/",
  "http://creativecommons.org/ns#",
  "http://web.resource.org/cc/",
  "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "http://www.serif.com/",
  "http://www.vector.evaxdesign.sk",
  "https://boxy-svg.com"
]);

// Attributes design tools leave behind that no browser reads.
const EDITOR_ATTRIBUTES = new Set(["enable-background", "data-name"]);

// Animation elements — their `fill` means "freeze or remove", not paint, so the defaults pass must not touch them.
const ANIMATION_ELEMENTS = new Set(["animate", "animateTransform", "animateMotion", "set"]);

// Containers whose content is rendered somewhere else (via <use>, url(#…) or a marker), so it doesn't inherit from its DOM ancestors.
const REFERENCED_CONTAINERS = new Set(["defs", "symbol", "clipPath", "mask", "pattern", "marker"]);

// Containers that render nothing when empty.
const REMOVABLE_WHEN_EMPTY = new Set(["g", "defs", "switch", "a", "text", "tspan", "style", "title", "desc", "symbol"]);

// Inheritable presentation properties with their initial values — removable when they match what the element would inherit anyway.
const INHERITABLE_DEFAULTS: Record<string, string[]> = {
  fill: ["#000", "#000000", "black"],
  "fill-opacity": ["1"],
  "fill-rule": ["nonzero"],
  "clip-rule": ["nonzero"],
  stroke: ["none"],
  "stroke-width": ["1"],
  "stroke-opacity": ["1"],
  "stroke-linecap": ["butt"],
  "stroke-linejoin": ["miter"],
  "stroke-miterlimit": ["4"],
  "stroke-dasharray": ["none"],
  "stroke-dashoffset": ["0"],
  visibility: ["visible"],
  "font-style": ["normal"],
  "font-weight": ["normal", "400"],
  "text-anchor": ["start"]
};

// Non-inheritable attributes whose value equals the browser's default, per element ("*" for any element).
const ELEMENT_DEFAULTS: Array<{ name: string; values: string[]; elements: string[] | "*" }> = [
  { name: "opacity", values: ["1"], elements: "*" },
  { name: "display", values: ["inline"], elements: "*" },
  { name: "x", values: ["0", "0px"], elements: ["svg", "rect", "use", "image", "pattern", "foreignObject"] },
  { name: "y", values: ["0", "0px"], elements: ["svg", "rect", "use", "image", "pattern", "foreignObject"] },
  { name: "cx", values: ["0"], elements: ["circle", "ellipse"] },
  { name: "cy", values: ["0"], elements: ["circle", "ellipse"] },
  { name: "x1", values: ["0"], elements: ["line"] },
  { name: "y1", values: ["0"], elements: ["line"] },
  { name: "x2", values: ["0"], elements: ["line"] },
  { name: "y2", values: ["0"], elements: ["line"] },
  { name: "x1", values: ["0", "0%"], elements: ["linearGradient"] },
  { name: "y1", values: ["0", "0%"], elements: ["linearGradient"] },
  { name: "x2", values: ["100%"], elements: ["linearGradient"] },
  { name: "y2", values: ["0", "0%"], elements: ["linearGradient"] },
  { name: "cx", values: ["50%"], elements: ["radialGradient"] },
  { name: "cy", values: ["50%"], elements: ["radialGradient"] },
  { name: "r", values: ["50%"], elements: ["radialGradient"] },
  { name: "gradientUnits", values: ["objectBoundingBox"], elements: ["linearGradient", "radialGradient"] },
  { name: "spreadMethod", values: ["pad"], elements: ["linearGradient", "radialGradient"] },
  { name: "offset", values: ["0"], elements: ["stop"] },
  { name: "stop-opacity", values: ["1"], elements: ["stop"] },
  { name: "stop-color", values: ["#000", "#000000", "black"], elements: ["stop"] },
  { name: "preserveAspectRatio", values: ["xMidYMid", "xMidYMid meet"], elements: ["svg", "image", "marker", "pattern", "symbol", "view"] },
  { name: "version", values: ["1.0", "1.1"], elements: ["svg"] },
  { name: "baseProfile", values: ["none", "full"], elements: ["svg"] }
];

// Attributes rounded as a single number (with an optional unit).
const NUMERIC_ATTRIBUTES = new Set([
  "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry", "fx", "fy", "fr", "width", "height", "stroke-width",
  "stroke-miterlimit", "stroke-dashoffset", "font-size", "letter-spacing", "word-spacing", "dx", "dy", "refX", "refY",
  "markerWidth", "markerHeight", "startOffset", "stdDeviation", "radius", "surfaceScale", "pathLength"
]);

// Unit-interval attributes, where precision 0 would snap 0.4 to 0 — these always keep at least three places.
const FRACTION_ATTRIBUTES = new Set(["opacity", "fill-opacity", "stroke-opacity", "stop-opacity", "offset", "k1", "k2", "k3", "k4"]);

// Attributes holding a list of numbers (or numbers inside function syntax), rounded number by number.
const LIST_ATTRIBUTES = new Set(["viewBox", "points", "stroke-dasharray", "transform", "gradientTransform", "patternTransform"]);

// A lone number with an optional CSS unit.
const UNIT_NUMBER_RE = new RegExp(`^(${NUMBER_SOURCE})(px|%|em|ex|pt|pc|mm|cm|in)?$`);

// Lowercased, colour-normalised form of a value so "#000" and "black" compare equal.
function normaliseValue(value: string): string {
  return shortenColour(value.trim().toLowerCase());
}

// Canonical attribute order: identity first, then geometry, then paint — the same positions in every element help gzip find repeats.
const ATTRIBUTE_ORDER = ["id", "xmlns", "width", "height", "viewBox", "x", "x1", "x2", "y", "y1", "y2", "cx", "cy", "r", "rx", "ry", "fill", "stroke", "marker", "d", "points"];

// Sort key for one attribute name — namespace declarations right after xmlns, unlisted names alphabetically at the end.
function attributeRank(name: string): [number, string] {
  if (name.startsWith("xmlns:")) return [1.5, name];
  const index = ATTRIBUTE_ORDER.indexOf(name);
  return [index === -1 ? ATTRIBUTE_ORDER.length : index, name];
}

// The serialised length of one element on its own — what shapesToPaths compares before and after.
function elementLength(element: OptElement): number {
  return serialiseNode(element).length;
}

// Reads a plain number attribute, defaulting where the spec does; null for units or percentages, which a path can't express.
function plainNumberAttr(element: OptElement, name: string, fallback: number | null): number | null {
  const raw = getAttr(element, name);
  if (raw === undefined) return fallback;
  const match = new RegExp(`^\\s*(${NUMBER_SOURCE})(px)?\\s*$`).exec(raw);
  return match ? parseFloat(match[1]) : null;
}

// Every number in a points list, or null when the list is ragged.
function parsePoints(points: string): number[] | null {
  const numbers = Array.from(points.matchAll(new RegExp(NUMBER_SOURCE, "g")), (match) => parseFloat(match[0]));
  return numbers.length >= 4 && numbers.length % 2 === 0 ? numbers : null;
}

// The path segments equivalent to a simple shape, or null when the shape uses something a plain path can't (rounded corners, units).
function shapeToSegments(element: OptElement): PathSegment[] | null {
  const name = localName(element.name);
  if (name === "rect") {
    const rx = getAttr(element, "rx");
    const ry = getAttr(element, "ry");
    if ((rx !== undefined && parseFloat(rx) !== 0) || (ry !== undefined && parseFloat(ry) !== 0)) return null;
    const x = plainNumberAttr(element, "x", 0);
    const y = plainNumberAttr(element, "y", 0);
    const width = plainNumberAttr(element, "width", null);
    const height = plainNumberAttr(element, "height", null);
    if (x === null || y === null || width === null || height === null || width <= 0 || height <= 0) return null;
    return [
      { command: "M", args: [x, y] },
      { command: "H", args: [x + width] },
      { command: "V", args: [y + height] },
      { command: "H", args: [x] },
      { command: "z", args: [] }
    ];
  }
  if (name === "line") {
    const coords = ["x1", "y1", "x2", "y2"].map((attr) => plainNumberAttr(element, attr, 0));
    if (coords.some((value) => value === null)) return null;
    const [x1, y1, x2, y2] = coords as number[];
    return [
      { command: "M", args: [x1, y1] },
      { command: "L", args: [x2, y2] }
    ];
  }
  if (name === "polyline" || name === "polygon") {
    const numbers = parsePoints(getAttr(element, "points") ?? "");
    if (!numbers) return null;
    const segments: PathSegment[] = [{ command: "M", args: numbers.slice(0, 2) }];
    for (let k = 2; k < numbers.length; k += 2) segments.push({ command: "L", args: numbers.slice(k, k + 2) });
    if (name === "polygon") segments.push({ command: "z", args: [] });
    return segments;
  }
  return null;
}

// The geometry attributes a converted shape no longer needs.
const SHAPE_GEOMETRY = new Set(["x", "y", "width", "height", "rx", "ry", "x1", "y1", "x2", "y2", "points"]);

/* ──────────────────────────────── Passes ──────────────────────────────── */

// The XML declaration, doctypes and processing instructions.
function stripProlog(doc: OptDocument) {
  doc.declaration = null;
  doc.before = doc.before.filter((node) => node.kind === "comment");
  doc.after = doc.after.filter((node) => node.kind === "comment");
}

// Comments everywhere, bar licence comments that start with "!".
function stripComments(doc: OptDocument) {
  const keep = (value: string) => value.startsWith("!");
  doc.before = doc.before.filter((node) => node.kind !== "comment" || keep(node.value));
  doc.after = doc.after.filter((node) => node.kind !== "comment" || keep(node.value));
  walk(doc.root, (element) => {
    element.children = element.children.filter((child) => child.kind !== "comment" || keep(child.value));
  });
}

// A <desc> that only advertises the tool ("Created with Sketch.") rather than describing the artwork.
function isEditorDesc(element: OptElement): boolean {
  if (localName(element.name) !== "desc") return false;
  const text = element.children.map((child) => (child.kind === "text" ? child.value : "")).join("").trim();
  return /^(created|generated|exported) (with|by|using)\b/i.test(text);
}

/*
  <metadata>, editor-namespaced elements and attributes, then any namespace declaration nothing
  uses any more. Editor content is matched by namespace URI and, as a fallback, by the prefixes
  those URIs are declared under — so a declaration is never dropped while something still uses it.
*/
function stripMetadata(doc: OptDocument) {
  const editorPrefixes = new Set<string>();
  walk(doc.root, (element) => {
    for (const attribute of element.attributes) if (attribute.name.startsWith("xmlns:") && EDITOR_NAMESPACES.has(attribute.value)) editorPrefixes.add(attribute.name.slice(6));
  });
  const isEditor = (name: string, ns: string | null) => (ns !== null && EDITOR_NAMESPACES.has(ns)) || (name.includes(":") && editorPrefixes.has(name.split(":")[0]));

  walk(doc.root, (element) => {
    element.children = element.children.filter(
      (child) => child.kind !== "element" || (localName(child.name) !== "metadata" && !isEditor(child.name, child.ns) && !isEditorDesc(child))
    );
    removeAttrs(element, (attribute) => (!attribute.name.startsWith("xmlns") && isEditor(attribute.name, attribute.ns)) || EDITOR_ATTRIBUTES.has(attribute.name));
  });

  const usedPrefixes = new Set<string>();
  walk(doc.root, (element) => {
    const names = [element.name, ...element.attributes.filter((attribute) => !attribute.name.startsWith("xmlns")).map((attribute) => attribute.name)];
    for (const name of names) if (name.includes(":")) usedPrefixes.add(name.split(":")[0]);
  });
  walk(doc.root, (element) => removeAttrs(element, (attribute) => attribute.name.startsWith("xmlns:") && !usedPrefixes.has(attribute.name.slice(6))));
}

// Attributes with nothing in them — an empty value is either ignored by the browser or invalid, which renders the same.
function removeEmptyAttrs(doc: OptDocument) {
  walk(doc.root, (element) => removeAttrs(element, (attribute) => attribute.value.trim() === "" && !attribute.name.startsWith("xmlns")));
}

// Ids nothing references; sprite-facing ids (<symbol>, <svg>, <view>) stay because they're referenced from outside the file.
function removeUnusedIds(doc: OptDocument) {
  const referenced = referencedIds(doc);
  const sheet = scriptAndStyleText(doc);
  walk(doc.root, (element) => {
    if (["symbol", "svg", "view"].includes(localName(element.name))) return;
    removeAttrs(element, (attribute) => attribute.name === "id" && !referenced.has(attribute.value) && !sheet.includes(attribute.value));
  });
}

/*
  Element defaults always; inheritable defaults only when it's provably safe — no stylesheet that
  could override inheritance, and not inside content rendered elsewhere (defs, symbols, anything a
  <use> clones), where the inherited value comes from the referencing element instead.
*/
function removeDefaults(doc: OptDocument) {
  const stylesheet = hasStylesheet(doc);
  const cloned = referencedIds(doc);

  const visit = (element: OptElement, inherited: Map<string, string>, detached: boolean) => {
    const name = localName(element.name);
    if (ANIMATION_ELEMENTS.has(name)) return;
    const isDetached = detached || REFERENCED_CONTAINERS.has(name) || cloned.has(getAttr(element, "id") ?? "");

    const isElementDefault = (property: string, value: string) =>
      ELEMENT_DEFAULTS.some((rule) => rule.name === property && (rule.elements === "*" || rule.elements.includes(name)) && rule.values.includes(value.trim()));
    const isInheritedDefault = (property: string, value: string) => {
      const defaults = INHERITABLE_DEFAULTS[property];
      if (!defaults || stylesheet || isDetached) return false;
      if (value.trim() === "inherit") return true;
      const effective = inherited.get(property);
      const normalised = normaliseValue(value);
      return effective !== undefined ? normalised === effective : defaults.map(normaliseValue).includes(normalised);
    };

    removeAttrs(element, (attribute) => isElementDefault(attribute.name, attribute.value) || isInheritedDefault(attribute.name, attribute.value));
    const style = getAttr(element, "style");
    if (style !== undefined) {
      const declarations = parseStyle(style);
      const kept = declarations.filter(([property, value]) => !isElementDefault(property, value) && !isInheritedDefault(property, value));
      if (kept.length === 0) removeAttrs(element, (attribute) => attribute.name === "style");
      else if (kept.length !== declarations.length) setAttr(element, "style", stringifyStyle(kept));
    }

    const next = new Map(inherited);
    for (const attribute of element.attributes) if (INHERITABLE_DEFAULTS[attribute.name]) next.set(attribute.name, normaliseValue(attribute.value));
    for (const [property, value] of parseStyle(getAttr(element, "style") ?? "")) if (INHERITABLE_DEFAULTS[property]) next.set(property, normaliseValue(value));
    for (const child of element.children) if (child.kind === "element") visit(child, next, isDetached);
  };

  visit(doc.root, new Map(), false);
}

// Whether an element has anything worth rendering inside it.
function isEmpty(element: OptElement): boolean {
  return element.children.every((child) => child.kind === "text" && child.value.trim() === "");
}

// Empty containers, bottom-up so a group holding only empty groups goes too; a group with a filter stays, since filters can paint from nothing.
function removeEmptyContainers(doc: OptDocument) {
  walkPost(doc.root, (element) => {
    element.children = element.children.filter(
      (child) => child.kind !== "element" || !(REMOVABLE_WHEN_EMPTY.has(localName(child.name)) && isEmpty(child) && getAttr(child, "filter") === undefined)
    );
  });
}

// Group attributes that mean the same thing when moved onto a lone child.
const MOVABLE_GROUP_ATTRIBUTES = new Set([...Object.keys(INHERITABLE_DEFAULTS), "transform", "opacity", "color", "font-family", "font-size", "stroke-dasharray"]);

/*
  Unwraps <g>s that do nothing: attribute-less groups give their children to the parent, and a
  group with one child pushes its paint/transform attributes down onto that child first. Skipped
  entirely when a stylesheet exists, since a selector like "g > path" would stop matching.
*/
function collapseGroups(doc: OptDocument) {
  if (hasStylesheet(doc)) return;
  const cloned = referencedIds(doc);
  walkPost(doc.root, (parent) => {
    if (localName(parent.name) === "switch" || localName(parent.name) === "clipPath") return;
    const next: OptNode[] = [];
    for (const child of parent.children) {
      if (child.kind !== "element" || localName(child.name) !== "g") {
        next.push(child);
        continue;
      }
      const elements = child.children.filter((node): node is OptElement => node.kind === "element");
      if (elements.length === 1 && child.attributes.length > 0) {
        const only = elements[0];
        const movable =
          !ANIMATION_ELEMENTS.has(localName(only.name)) &&
          !cloned.has(getAttr(only, "id") ?? "") &&
          child.attributes.every((attribute) => MOVABLE_GROUP_ATTRIBUTES.has(attribute.name) && (attribute.name === "transform" || getAttr(only, attribute.name) === undefined));
        if (movable) {
          for (const attribute of child.attributes) {
            const existing = getAttr(only, attribute.name);
            if (attribute.name === "transform" && existing !== undefined) setAttr(only, "transform", `${attribute.value} ${existing}`);
            else only.attributes.unshift({ ...attribute });
          }
          child.attributes = [];
        }
      }
      if (child.attributes.length === 0) next.push(...child.children);
      else next.push(child);
    }
    parent.children = next;
  });
}

// Rounds geometry to the chosen precision; opacities keep at least three places so they never snap to fully on or off.
function roundNumbers(doc: OptDocument, context: PassContext) {
  walk(doc.root, (element) => {
    for (const attribute of element.attributes) {
      const name = attribute.name;
      if (name === "d") attribute.value = roundPathData(attribute.value, context.precision);
      else if (LIST_ATTRIBUTES.has(name)) attribute.value = mapNumbers(attribute.value, (value) => compactNumber(roundTo(value, context.precision)));
      else if (NUMERIC_ATTRIBUTES.has(name) || FRACTION_ATTRIBUTES.has(name)) {
        const match = UNIT_NUMBER_RE.exec(attribute.value.trim());
        if (!match) continue;
        const places = FRACTION_ATTRIBUTES.has(name) ? Math.max(context.precision, 3) : context.precision;
        attribute.value = `${compactNumber(roundTo(parseFloat(match[1]), places))}${match[2] ?? ""}`;
      } else if (name === "style") {
        const declarations = parseStyle(attribute.value).map(([property, value]): [string, string] => {
          const match = UNIT_NUMBER_RE.exec(value);
          if (!match || !(NUMERIC_ATTRIBUTES.has(property) || FRACTION_ATTRIBUTES.has(property))) return [property, value];
          const places = FRACTION_ATTRIBUTES.has(property) ? Math.max(context.precision, 3) : context.precision;
          return [property, `${compactNumber(roundTo(parseFloat(match[1]), places))}${match[2] ?? ""}`];
        });
        attribute.value = stringifyStyle(declarations);
      }
    }
  });
}

// Colours in presentation attributes and inline style declarations.
function shortenColours(doc: OptDocument) {
  walk(doc.root, (element) => {
    for (const attribute of element.attributes) {
      if (COLOUR_PROPERTIES.has(attribute.name)) attribute.value = shortenColour(attribute.value);
      else if (attribute.name === "style") {
        const declarations = parseStyle(attribute.value);
        if (declarations.some(([property]) => COLOUR_PROPERTIES.has(property))) {
          attribute.value = stringifyStyle(declarations.map(([property, value]) => [property, COLOUR_PROPERTIES.has(property) ? shortenColour(value) : value]));
        }
      }
    }
  });
}

// Simple shapes become paths, but only when the path really is shorter — never when a stylesheet might select them by tag name, nor when an <animate> child targets their geometry.
function shapesToPaths(doc: OptDocument) {
  if (hasStylesheet(doc)) return;
  walk(doc.root, (element) => {
    element.children = element.children.map((child) => {
      if (child.kind !== "element" || child.children.some((node) => node.kind === "element")) return child;
      const segments = shapeToSegments(child);
      if (!segments) return child;
      const prefix = child.name.includes(":") ? `${child.name.split(":")[0]}:` : "";
      const candidate: OptElement = {
        ...child,
        name: `${prefix}path`,
        attributes: [...child.attributes.filter((attribute) => !SHAPE_GEOMETRY.has(attribute.name)), { name: "d", value: emitPath(segments), ns: null }]
      };
      return elementLength(candidate) < elementLength(child) ? candidate : child;
    });
  });
}

// Path data in its shortest form, and polyline/polygon point lists with no spare separators.
function minifyPaths(doc: OptDocument) {
  walk(doc.root, (element) => {
    const name = localName(element.name);
    for (const attribute of element.attributes) {
      if (attribute.name === "d" && name === "path") {
        const minified = minifyPathData(attribute.value);
        if (minified !== null && minified.length <= attribute.value.length) attribute.value = minified;
      } else if (attribute.name === "points" && (name === "polyline" || name === "polygon")) {
        const numbers = parsePoints(attribute.value);
        if (numbers) attribute.value = joinNumbers(numbers.map(compactNumber));
      }
    }
  });
}

// width/height off the root in favour of the viewBox — synthesising a viewBox from plain pixel sizes when there isn't one yet.
function removeDimensions(doc: OptDocument) {
  const root = doc.root;
  if (getAttr(root, "viewBox") === undefined) {
    const width = plainNumberAttr(root, "width", null);
    const height = plainNumberAttr(root, "height", null);
    if (width === null || height === null) return;
    setAttr(root, "viewBox", `0 0 ${compactNumber(width)} ${compactNumber(height)}`);
  }
  removeAttrs(root, (attribute) => attribute.name === "width" || attribute.name === "height");
}

// Drops attributes an inline style overrides anyway, then sorts what's left into the canonical order.
function sortAttrs(doc: OptDocument) {
  walk(doc.root, (element) => {
    const styled = new Set(parseStyle(getAttr(element, "style") ?? "").map(([property]) => property));
    if (styled.size > 0) removeAttrs(element, (attribute) => attribute.name !== "style" && styled.has(attribute.name));
    element.attributes.sort((a, b) => {
      const [rankA, nameA] = attributeRank(a.name);
      const [rankB, nameB] = attributeRank(b.name);
      return rankA - rankB || nameA.localeCompare(nameB);
    });
  });
}

/*
  Formatting whitespace between tags goes, runs of spaces inside attribute values and text collapse
  to one (what the renderer does anyway), and a <style> sheet loses the spaces around its braces
  and semicolons. Inside text elements whitespace is only collapsed, never removed, because a lone
  space between two <tspan>s is visible — and xml:space="preserve" text is left exactly as written.
  Where there's no text at all, xml:space itself is dead weight and goes too.
*/
function collapseWhitespace(doc: OptDocument) {
  doc.separator = "";
  let hasText = false;
  walk(doc.root, (element) => {
    if (["text", "tspan", "textPath"].includes(localName(element.name))) hasText = true;
  });

  const visit = (element: OptElement, preserve: boolean) => {
    const name = localName(element.name);
    const space = getAttr(element, "xml:space");
    const preserving = space === undefined ? preserve : space === "preserve";
    for (const attribute of element.attributes) attribute.value = attribute.value.replace(/\s+/g, " ").trim();
    if (!hasText) removeAttrs(element, (attribute) => attribute.name === "xml:space");

    const keepsText = TEXT_BEARING.has(name);
    element.children = element.children
      .filter((child) => keepsText || child.kind !== "text" || child.value.trim() !== "")
      .map((child) => {
        if (child.kind === "element" || child.kind === "comment" || (preserving && keepsText)) return child;
        if (name === "style") return { ...child, value: child.value.replace(/\s+/g, " ").replace(/\s*([{};])\s*/g, "$1").replace(/;}/g, "}").trim() };
        return { ...child, value: child.value.replace(/\s+/g, " ") };
      });
    for (const child of element.children) if (child.kind === "element") visit(child, preserving);
  };

  visit(doc.root, false);
}

// Pass ids to their implementations, so the run order lives in PASS_META alone.
const PASSES: Record<PassId, PassFunction> = {
  stripProlog,
  stripComments,
  stripMetadata,
  removeEmptyAttrs,
  removeUnusedIds,
  removeDefaults,
  removeEmptyContainers,
  collapseGroups,
  roundNumbers,
  shortenColours,
  shapesToPaths,
  minifyPaths,
  removeDimensions,
  sortAttrs,
  collapseWhitespace
};

/* ──────────────────────────────── Preview sanitiser ──────────────────────────────── */

// Elements that can run script, embed other documents or reach outside the image — never rendered in the preview.
const BLOCKED_ELEMENTS = new Set(["script", "foreignObject", "iframe", "embed", "object", "audio", "video", "canvas", "handler", "listener"]);

// URL schemes that execute or smuggle a document; images in data: URLs are fine.
const UNSAFE_URL_RE = /^\s*(?:javascript|vbscript|data:(?!image\/(?:png|jpe?g|gif|webp|avif|svg\+xml)))/i;

// Browsers ignore whitespace and control characters inside a URL scheme ("java\tscript:"), so they're removed before the scheme is checked.
function stripInvisible(value: string): string {
  return Array.from(value)
    .filter((char) => char.charCodeAt(0) > 32)
    .join("");
}

// One element, sanitised — returns null when the whole element has to go.
function sanitiseElement(element: OptElement, counts: SanitiseCounts): OptElement | null {
  const name = localName(element.name);
  if (BLOCKED_ELEMENTS.has(name)) {
    counts.elements++;
    return null;
  }
  if ((name === "set" || name === "animate") && /href/i.test(getAttr(element, "attributeName") ?? "")) {
    counts.elements++;
    return null;
  }
  const attributes = element.attributes.filter((attribute) => {
    if (/^on/i.test(localName(attribute.name))) {
      counts.handlers++;
      return false;
    }
    const compact = stripInvisible(attribute.value);
    if ((attribute.name === "href" || attribute.name.endsWith(":href") || attribute.name === "src") && UNSAFE_URL_RE.test(compact)) {
      counts.urls++;
      return false;
    }
    if (attribute.name === "style" && /javascript:|expression\(/i.test(compact)) {
      counts.urls++;
      return false;
    }
    return true;
  });
  const children: OptNode[] = [];
  for (const child of element.children) {
    if (child.kind !== "element") children.push(child);
    else {
      const clean = sanitiseElement(child, counts);
      if (clean) children.push(clean);
    }
  }
  return { ...element, attributes, children };
}

/*
  Sanitised markup for the preview <img>. An <img> already refuses to run script or load anything
  external, but the tree is scrubbed too — scripts, handlers, foreignObject and javascript: links —
  so nothing unsafe is even handed to the browser. A missing xmlns is added, since an image can't
  render an un-namespaced <svg>.
*/
export function sanitiseForPreview(doc: OptDocument, counts: SanitiseCounts): string {
  const root = sanitiseElement(doc.root, counts) ?? { ...doc.root, children: [] };
  if (getAttr(root, "xmlns") === undefined) root.attributes = [{ name: "xmlns", value: "http://www.w3.org/2000/svg", ns: XMLNS_NS }, ...root.attributes];
  return serialiseNode(root);
}

// The preview markup as an <img>-ready data URI.
export function toDataUri(markup: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}

/* ──────────────────────────────── Optimiser ──────────────────────────────── */

// The result shape for a source that didn't parse — every panel can still render, just with nothing on the scale.
function emptyResult(error: string, bytesBefore: number): OptimiseResult {
  return {
    error,
    output: "",
    bytesBefore,
    bytesAfter: bytesBefore,
    roundTrip: 0,
    reports: PASS_META.map((meta) => ({ id: meta.id, enabled: false, saved: 0 })),
    previewBefore: "",
    previewAfter: "",
    sanitised: { elements: 0, handlers: 0, urls: 0 },
    prettyBefore: "",
    prettyAfter: ""
  };
}

/*
  Runs every enabled pass in order on one working copy, weighing the document after each so every
  pass is credited with exactly the bytes it removed. Switched-off passes are then trialled once on
  the finished output, so their stamp can say what turning them on would still save.
*/
export function optimiseSvg(state: SvgOptimiserEditorState): OptimiseResult {
  const bytesBefore = byteLength(state.source.trim());
  const parsed = parseSvg(state.source);
  if (!parsed.doc) return emptyResult(parsed.error ?? "Invalid SVG markup.", bytesBefore);

  const context: PassContext = { precision: state.precision };
  const original = structuredClone(parsed.doc);
  const doc = parsed.doc;
  let current = byteLength(serialiseDocument(doc));
  const roundTrip = bytesBefore - current;

  const savedById = new Map<PassId, number>();
  for (const meta of PASS_META) {
    if (!state.passes[meta.id]) continue;
    PASSES[meta.id](doc, context);
    const size = byteLength(serialiseDocument(doc));
    savedById.set(meta.id, current - size);
    current = size;
  }

  const reports: PassReport[] = PASS_META.map((meta) => {
    if (state.passes[meta.id]) return { id: meta.id, enabled: true, saved: savedById.get(meta.id) ?? 0 };
    const trial = structuredClone(doc);
    PASSES[meta.id](trial, context);
    return { id: meta.id, enabled: false, saved: current - byteLength(serialiseDocument(trial)) };
  });

  const sanitised: SanitiseCounts = { elements: 0, handlers: 0, urls: 0 };
  const previewBefore = sanitiseForPreview(original, sanitised);
  const previewAfter = sanitiseForPreview(doc, { elements: 0, handlers: 0, urls: 0 });

  return {
    error: null,
    output: serialiseDocument(doc),
    bytesBefore,
    bytesAfter: current,
    roundTrip,
    reports,
    previewBefore,
    previewAfter,
    sanitised,
    prettyBefore: prettyPrint(original),
    prettyAfter: prettyPrint(doc)
  };
}

/* ──────────────────────────────── Diff ──────────────────────────────── */

// Above this many line pairs the LCS table would cost more memory than a diff is worth, so the view falls back to plain output.
const MAX_DIFF_CELLS = 4_000_000;

/*
  Line diff via a longest-common-subsequence table — plenty for the few hundred lines a pretty-
  printed SVG runs to, and exact, unlike a heuristic diff. Returns null when the inputs are too big.
*/
export function diffLines(before: string, after: string): DiffLine[] | null {
  const a = before.split("\n");
  const b = after.split("\n");
  const n = a.length;
  const m = b.length;
  if ((n + 1) * (m + 1) > MAX_DIFF_CELLS) return null;

  const table = new Uint32Array((n + 1) * (m + 1));
  const at = (i: number, j: number) => i * (m + 1) + j;
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[at(i, j)] = a[i] === b[j] ? table[at(i + 1, j + 1)] + 1 : Math.max(table[at(i + 1, j)], table[at(i, j + 1)]);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      lines.push({ kind: "same", text: a[i] });
      i++;
      j++;
    } else if (table[at(i + 1, j)] >= table[at(i, j + 1)]) {
      lines.push({ kind: "removed", text: a[i++] });
    } else {
      lines.push({ kind: "added", text: b[j++] });
    }
  }
  while (i < n) lines.push({ kind: "removed", text: a[i++] });
  while (j < m) lines.push({ kind: "added", text: b[j++] });
  return lines;
}

// Folds unchanged runs longer than twice the context into one row, so a diff of a long file shows what changed without scrolling past what didn't.
export function foldUnchanged(lines: DiffLine[], context = 2): DiffRow[] {
  const rows: DiffRow[] = [];
  let index = 0;
  while (index < lines.length) {
    if (lines[index].kind !== "same") {
      rows.push(lines[index++]);
      continue;
    }
    let end = index;
    while (end < lines.length && lines[end].kind === "same") end++;
    const run = end - index;
    const head = index === 0 ? 0 : context;
    const tail = end === lines.length ? 0 : context;
    if (run > head + tail + 1) {
      rows.push(...lines.slice(index, index + head), { kind: "fold", count: run - head - tail }, ...lines.slice(end - tail, end));
    } else rows.push(...lines.slice(index, end));
    index = end;
  }
  return rows;
}
