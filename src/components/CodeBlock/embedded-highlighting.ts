import type { Highlighter } from "shiki";

/*
  Line-anchored to match how embedded-CSS snippets are authored, so a stray `</style>` inside a
  CSS string literal can't be mistaken for the real closing tag.
*/
const EMBEDDED_BLOCK_RE = /^[ \t]*<(style|script)(?:\s[^>]*)?>[ \t]*\n([\s\S]*?)\n[ \t]*<\/\1>[ \t]*$/m;

/*
  Inside foreign content like <svg>, Shiki's html grammar tokenises <style>/<script> content but
  the theme never colours it, and re-highlighting the fragment on its own flags ordinary SVG tags
  as invalid. Only swapping the embedded lines in from an isolated css/js pass keeps both the tags
  and the embedded code correct.
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

// Shiki emits one line span per source line, so splitting on newlines lets lines be swapped by index.
function extractLineSpans(html: string): string[] {
  const [open, close] = splitShell(html);
  return html.slice(open.length, html.length - close.length).split("\n");
}

// Preserves the full-document pass's <pre>/<code> wrapper so only line contents get replaced.
function splitShell(html: string): [string, string] {
  const codeStart = html.indexOf("<code>") + "<code>".length;
  const codeEnd = html.lastIndexOf("</code>");
  return [html.slice(0, codeStart), html.slice(codeEnd)];
}
