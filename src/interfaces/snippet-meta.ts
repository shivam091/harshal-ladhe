/*
  Props for the SnippetMeta row. Values are injected at build by the
  remark-snippet-meta plugin (string attributes from the MDX AST).
*/
export interface SnippetMetaProps {
  // Date of publish
  publishedAt?: string;
  // Date of last modification
  lastModifiedAt?: string;
  // Read time in minutes, passed as a string attribute from the remark plugin.
  readingMinutes?: string | number;
  // Total word count, shown as the read-time tooltip.
  words?: string | number;
}
