import type { JSX } from "react";
import type { ContentDatesProps } from "@/components/ContentDates/ContentDates.types";
import PublishedAt from "@/components/ContentDates/PublishedAt/PublishedAt";
import LastModifiedAt from "@/components/ContentDates/LastModifiedAt/LastModifiedAt";

// Tells readers how fresh the content is, adding a revision date only when there is a real revision to report.
export default function ContentDates({ lastModifiedAt, publishedAt }: ContentDatesProps): JSX.Element | null {
  if (!lastModifiedAt && !publishedAt) return null;

  // Compares just the date portion (YYYY-MM-DD) so a same-day edit doesn't spuriously show "last modified".
  const wasUpdated = lastModifiedAt && publishedAt && lastModifiedAt.slice(0, 10) !== publishedAt.slice(0, 10);

  return (
    <>
      <PublishedAt publishedAt={publishedAt} />
      {wasUpdated && <LastModifiedAt lastModifiedAt={lastModifiedAt} />}
    </>
  );
}

ContentDates.displayName = "ContentDates";
