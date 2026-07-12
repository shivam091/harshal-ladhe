import type { JSX } from "react";
import { formatDate } from "@/utils/date";
import type { LastModifiedAtProps } from "@/components/ContentDates/LastModifiedAt/LastModifiedAt.types";
import { DateText } from "@/components/ContentDates/ContentDates.styles";

// Renders "Last updated: <date>" if a date is provided; returns null otherwise.
export default function LastModifiedAt({ lastModifiedAt }: LastModifiedAtProps): JSX.Element | null {
  if (!lastModifiedAt) return null;

  return (
    <>
      <DateText>
        <em>Last updated: <time dateTime={lastModifiedAt}>{formatDate(lastModifiedAt)}</time></em>
      </DateText>
    </>
  );
}

LastModifiedAt.displayName = "LastModifiedAt";
