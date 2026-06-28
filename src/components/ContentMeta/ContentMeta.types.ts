// Values arrive as MDX string attributes injected at build, hence the loose string | number types.
export interface ContentMetaProps {
  // Names the meta group for screen readers.
  contentType: string;
  publishedAt?: string;
  lastModifiedAt?: string;
  readingMinutes?: string | number;
  // Backs the read-time tooltip so the estimate can be sanity-checked.
  words?: string | number;
}
