/*
  Props for the PostMeta row. Values are injected at build by the
  remark-post-meta plugin (string attributes from the MDX AST).
*/
export interface PostMetaProps {
  // Post slug (injected by the plugin) — used to resolve the post's series for
  // the primary-meta series badge.
  slug?: string;
  publishedAt?: string;
  lastModifiedAt?: string;
  // Read time in minutes, passed as a string attribute from the remark plugin.
  readingMinutes?: string | number;
  // Total word count, shown as the read-time tooltip.
  words?: string | number;
}
