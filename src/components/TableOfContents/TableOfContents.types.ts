// A single entry in the table of contents, extracted from a heading element in the post body.
export interface Heading {
  // The heading element's `id` attribute — used as the anchor target for the TOC link.
  id: string;
  // The heading's inner markup (hash anchor stripped), rendered as the link label — may include inline tags like <kbd> from Markdown.
  html: string;
  // Heading depth (h2–h4) — controls indentation and font size in the TOC.
  level: 2 | 3 | 4;
}

// Props accepted by the TableOfContents component.
export interface TableOfContentsProps {
  // Deepest heading level to include in the TOC (defaults to 3, i.e. h2 + h3).
  maxLevel?: 2 | 3 | 4;
}
