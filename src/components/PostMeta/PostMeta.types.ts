// Values arrive as MDX string attributes injected at build, hence the loose string | number types.
export interface PostMetaProps {
  // Lets the row show the post's series badge without the plugin knowing about series.
  slug?: string;
  publishedAt?: string;
  lastModifiedAt?: string;
  // Read time in minutes, passed as a string attribute from the remark plugin.
  readingMinutes?: string | number;
  // Backs the read-time tooltip so the estimate can be sanity-checked.
  words?: string | number;
}
