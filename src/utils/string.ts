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

// Untrusted text must be neutralized before it's injected as HTML, or it could run as markup or script.
export const escapeHTML = (str: string) => String(str)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

// Escape the five XML predefined entities for use in element text / attributes.
export const escapeXml = (str: string) => String(str)
  .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Collapse whitespace and hard-truncate to `max` chars for the entry summary.
export function truncate(value: string, max: number): string {
  const text = value.replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}
