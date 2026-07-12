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
