// Optional ISO date strings; component renders nothing if both are absent.
export interface ContentDatesProps {
  // ISO date string of the most recent content update; omitted when never updated post-publish.
  lastModifiedAt?: string;
  // ISO date string of the original publish date; omitted when the content has no publish history yet.
  publishedAt?: string;
}
