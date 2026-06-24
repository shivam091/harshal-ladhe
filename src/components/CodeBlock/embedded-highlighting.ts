import type { Highlighter } from "shiki";

/*
  A <style>/<script> tag on its own line, through its matching closing tag on its own line —
  how every embedded-CSS snippet in this repo is authored (see SvgSnippet's Heart Shape / Sun
  Icon examples). Kept line-anchored rather than a general [\s\S]*? scan so a stray `</style>`
  inside a CSS string literal can't be mistaken for the real closing tag.
*/
const EMBEDDED_BLOCK_RE = /^[ \t]*<(style|script)(?:\s[^>]*)?>[ \t]*\n([\s\S]*?)\n[ \t]*<\/\1>[ \t]*$/m;

/*
  Shiki's `html` grammar only extends its css/javascript injection into a <style>/<script> tag
  when that tag sits in ordinary HTML content. Nested inside a "foreign content" element like
  <svg>, the tag's content still tokenizes, but the theme's color rules never resolve against
  it, so it renders as one flat, unstyled span — independent of theme, load order, or how many
  other languages are loaded (verified directly against this project's Shiki setup). There's no
  dedicated `svg` grammar to fall back on.

  Re-highlighting the embedded region as its own isolated css/js fragment fixes the color, but
  breaks something else: a lone closing tag with no matching opening tag in the same fragment
  (or vice versa) falls back to strict tag-name validation and flags ordinary SVG tags like
  <path>/<svg> as invalid — the grammar only relaxes that check for tags it can see are inside a
  matched <svg>...</svg> subtree. So instead this highlights the *whole* document once (which
  gets every tag right, since it sees the full structure) and then swaps in just the specific
  line-spans for the embedded region from a second, isolated css/js-only pass — every other line
  is left exactly as the full-document pass produced it.
*/
export function highlightHtmlWithEmbeds(code: string, highlighter: Highlighter, theme: string): string {
  const match = code.match(EMBEDDED_BLOCK_RE);
  const fullHtml = highlighter.codeToHtml(code, { lang: "html", theme });
  if (!match) return fullHtml;

  const [, tagName, inner] = match;
  const start = match.index ?? 0;
  const firstInnerLine = code.slice(0, start).split("\n").length + 1; // 1-indexed; +1 skips the <style> line itself
  const innerLineCount = inner.split("\n").length;

  const embeddedLang = tagName === "style" ? "css" : "javascript";
  const innerHtml = highlighter.codeToHtml(inner, { lang: embeddedLang, theme });

  const fullLines = extractLineSpans(fullHtml);
  const innerLines = extractLineSpans(innerHtml);
  if (innerLines.length !== innerLineCount) return fullHtml; // Shape mismatch — bail out to the safe (if unstyled) default.

  fullLines.splice(firstInnerLine - 1, innerLineCount, ...innerLines);

  const [openShell, closeShell] = splitShell(fullHtml);
  return openShell + fullLines.join("\n") + closeShell;
}

// Splits a codeToHtml() result's <code> contents into one string per <span class="line">...</span>.
function extractLineSpans(html: string): string[] {
  const [open, close] = splitShell(html);
  return html.slice(open.length, html.length - close.length).split("\n");
}

// Splits a codeToHtml() result into its opening shell (through <code>) and closing shell (from </code>).
function splitShell(html: string): [string, string] {
  const codeStart = html.indexOf("<code>") + "<code>".length;
  const codeEnd = html.lastIndexOf("</code>");
  return [html.slice(0, codeStart), html.slice(codeEnd)];
}
