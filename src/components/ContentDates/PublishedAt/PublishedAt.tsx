import type { JSX } from "react";
import { formatDate } from "@/utils/date";
import type { PublishedAtProps } from "@/components/ContentDates/PublishedAt/PublishedAt.types";
import { DateText } from "@/components/ContentDates/ContentDates.styles";

// Anchors the content in time so readers can judge how current it is.
export default function PublishedAt({ publishedAt }: PublishedAtProps): JSX.Element | null {
  if (!publishedAt) return null;

  return (
    <>
      <DateText>
        <em>Published: <time dateTime={publishedAt}>{formatDate(publishedAt)}</time></em>
      </DateText>
    </>
  );
}

PublishedAt.displayName = "PublishedAt";
