/*
  Converts a camelCase or PascalCase string to its hyphenated (kebab-case) equivalent.
*/
export const hyphenate = (value: string) =>
  value
    .replace(/([A-Z])/g, "-$1")
    .replace(/([a-z])(\d)/g, "$1-$2")
    .toLowerCase();


// Converts a heading text to a URL-safe lowercase slug for use as an HTML id or anchor href.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Recursively extracts plain text from a React node tree; used to derive anchor slugs from heading children.
export function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children !== null && typeof children === "object") {
    const el = children as React.ReactElement<{ children?: React.ReactNode }>;
    if (el.props?.children !== undefined) return extractText(el.props.children);
  }
  return "";
}

/*
  Escapes special HTML characters (&, <, >, ", ') in a string to their
  corresponding HTML entities. This prevents the browser from interpreting the characters
  as markup or script, making the string safe for rendering in an HTML context.
*/
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
