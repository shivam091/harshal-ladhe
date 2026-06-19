// Inline substitutions shared by both converters below: bold, links, and backtick code spans (rendered as <kbd>, matching the site's pressed-key styling for short technical terms).
function applyInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

// Converts a subset of Markdown (bold, links, backtick code spans, blank-line paragraphs) to an HTML string.
export function markdownToHtml(text: string): string {
  return text
    .split("\n\n")
    .map(p => `<p>${applyInlineMarkdown(p.trim())}</p>`)
    .join("");
}

// Converts a single line of inline Markdown (bold, links, backtick code spans) to an HTML string, without paragraph wrapping — for titles and other short single-line labels.
export function inlineMarkdownToHtml(text: string): string {
  return applyInlineMarkdown(text);
}
