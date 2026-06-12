// Both dates optional so pages without any date history can still render the component safely.
export interface ContentDatesProps {
  // Absent when the content was never revised after publishing.
  lastModifiedAt?: string;
  // Absent when the content has no publish history yet.
  publishedAt?: string;
}
