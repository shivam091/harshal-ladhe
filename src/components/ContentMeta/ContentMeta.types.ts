/*
  Props for the ContentMeta row, shared by snippets and tutorials. Values are
  injected at build by the remark-content-metadata plugin (string attributes
  from the MDX AST).
*/
export interface ContentMetaProps {
  // Human-readable content type ("Snippet", "Tutorial", ...) — drives the group's aria-label.
  contentType: string;
  // Date of publish
  publishedAt?: string;
  // Date of last modification
  lastModifiedAt?: string;
  // Read time in minutes, passed as a string attribute from the remark plugin.
  readingMinutes?: string | number;
  // Total word count, shown as the read-time tooltip.
  words?: string | number;
}
