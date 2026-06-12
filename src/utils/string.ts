// Turns camelCase token names into the kebab-case CSS expects for custom properties.
export const hyphenate = (value: string) =>
  value
    .replace(/([A-Z])/g, "-$1")
    .replace(/([a-z])(\d)/g, "$1-$2")
    .toLowerCase();


// Headings need stable, URL-safe ids so sections can be deep-linked.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Heading children may contain inline markup, so slugs must come from their text alone.
export function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children !== null && typeof children === "object") {
    const el = children as React.ReactElement<{ children?: React.ReactNode }>;
    if (el.props?.children !== undefined) return extractText(el.props.children);
  }
  return "";
}

// Post text can contain &, < and quotes, which would break the feed's XML unescaped.
export const escapeXml = (str: string) => String(str)
  .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Keeps feed summaries and meta descriptions short and on one line; backs off to a word break so no word is cut in half.
export function truncate(value: string, max: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;

  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
  return `${trimmed.replace(/[\s,;:—–-]+$/, "")}…`;
}
