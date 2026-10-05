import type { SvgElementNode, SvgNode, SvgParseResult } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// DOM nodeType constants spelled out locally — the Node global doesn't exist during server rendering, and these values are fixed by the DOM spec anyway.
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const CDATA_SECTION_NODE = 4;
const COMMENT_NODE = 8;

// Elements whose text content is meaningful (and, for <style>, whitespace-sensitive enough to keep verbatim) — every other text run between tags is formatting whitespace.
const TEXT_BEARING_ELEMENTS = new Set(["text", "tspan", "textPath", "title", "desc", "style"]);

// Firefox reports XML errors in a namespaced <parsererror> root rather than Chrome's plain one, so both lookups are needed.
const MOZ_PARSER_ERROR_NS = "http://www.mozilla.org/newlayout/xml/parsererror.xml";

// Browsers wrap the actual XML error in boilerplate ("This page contains the following errors…", a source excerpt) — strip it so the message reads as one clear sentence.
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

// Copies a live DOM element into the tool's plain-object tree, so every later transform works on data it owns rather than on DOM state shared with the parser's document.
function toSvgNode(element: Element): SvgElementNode {
  const keepsText = TEXT_BEARING_ELEMENTS.has(element.localName);
  const children: SvgNode[] = [];

  element.childNodes.forEach((child) => {
    if (child.nodeType === ELEMENT_NODE) {
      children.push(toSvgNode(child as Element));
    } else if (child.nodeType === TEXT_NODE || child.nodeType === CDATA_SECTION_NODE) {
      const raw = child.nodeValue ?? "";
      if (!keepsText || raw.trim().length === 0) return;
      children.push({ kind: "text", value: element.localName === "style" ? raw.trim() : raw.replace(/\s+/g, " ").trim() });
    } else if (child.nodeType === COMMENT_NODE) {
      const value = (child.nodeValue ?? "").trim();
      if (value.length > 0) children.push({ kind: "comment", value });
    }
  });

  return {
    kind: "element",
    name: element.nodeName,
    // XML attribute normalisation should already fold tabs/newlines, but not every parser does — collapsing here keeps a multi-line `d` from printing its source indentation.
    attributes: Array.from(element.attributes).map((attribute) => [attribute.name, attribute.value.replace(/\s+/g, " ").trim()]),
    children
  };
}

/*
  Parses pasted SVG with the browser's own XML parser (image/svg+xml, so a stray unclosed tag is a
  hard error rather than HTML's silent recovery) and copies the result into a plain tree. Comments
  sitting outside the root <svg> are deliberately dropped here — they can't survive as JSX anyway,
  and they're nearly always an editor's "Generator: …" banner.
*/
export function parseSvg(source: string): SvgParseResult {
  const trimmed = source.trim();
  const hadProlog = /^(?:﻿)?\s*<\?xml|<!DOCTYPE/i.test(trimmed);

  if (trimmed.length === 0) return { root: null, error: "Nothing to convert yet — paste, drop or upload an SVG.", hadProlog };
  if (typeof DOMParser === "undefined") return { root: null, error: "SVG parsing needs a browser — reload the page with JavaScript enabled.", hadProlog };

  const doc = new DOMParser().parseFromString(trimmed, "image/svg+xml");
  const errorElement = doc.getElementsByTagName("parsererror")[0] ?? doc.getElementsByTagNameNS(MOZ_PARSER_ERROR_NS, "parsererror")[0];
  if (errorElement) return { root: null, error: describeParserError(errorElement), hadProlog };

  const rootElement = doc.documentElement;
  if (!rootElement || rootElement.localName !== "svg") {
    return { root: null, error: `Expected an <svg> root element but found <${rootElement?.nodeName ?? "nothing"}>.`, hadProlog };
  }

  return { root: toSvgNode(rootElement), error: null, hadProlog };
}
