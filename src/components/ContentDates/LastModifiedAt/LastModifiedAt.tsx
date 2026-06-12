import type { JSX } from "react";
import { formatDate } from "@/utils/date";
import type { LastModifiedAtProps } from "@/components/ContentDates/LastModifiedAt/LastModifiedAt.types";
import { DateText } from "@/components/ContentDates/ContentDates.styles";

// Signals that the content has been revised so readers can judge its freshness.
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
