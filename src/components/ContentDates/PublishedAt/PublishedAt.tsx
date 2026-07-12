import { JSX } from "react";
import { formatDate } from "@/utils/date";
import { PublishedAtProps } from "@/interfaces/content-dates";
import { DateText } from "@/components/ContentDates/ContentDates.styles";

// Renders "Published: <date>" if publishedAt is provided; returns null otherwise.
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
