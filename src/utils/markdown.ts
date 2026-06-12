// Authored text is plain prose, so a literal `<select>` must print as text rather than become a live element.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// One set of inline rules so paragraph and single-line output can never format differently.
function applyInlineMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

// A deliberately tiny subset — enough for authored blurbs without pulling in a full Markdown parser.
export function markdownToHtml(text: string): string {
  return text
    .split("\n\n")
    .map(p => `<p>${applyInlineMarkdown(p.trim())}</p>`)
    .join("");
}

// Skips paragraph wrapping so titles and short labels don't end up with a block-level <p> inside them.
export function inlineMarkdownToHtml(text: string): string {
  return applyInlineMarkdown(text);
}
