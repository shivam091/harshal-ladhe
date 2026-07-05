import { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Badge from "@/components/Badge";
import { BookIcon } from "@/components/Icon";
import type { SeriesBadgeProps } from "@/interfaces/series";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";

/*
  Compact "Series: Title (2/3)" indicator for a post — a book icon, a
  screen-reader "Series:" label, and a badge showing the series title and this
  post's position within it. Shown in a post's primary meta row (via PostMeta) and
  on /posts list cards.
*/
export default function SeriesBadge({ series, link = true }: SeriesBadgeProps): JSX.Element {
  return (
    <>
      <PageMetaItem className="post-series">
        <BookIcon />
        <VisuallyHidden>Series:</VisuallyHidden>
        <Badge href={link ? series.url : undefined} ariaLabel={`Series: ${series.title}`}>
          {series.title} ({series.index}/{series.total})
        </Badge>
      </PageMetaItem>
    </>
  );
}

SeriesBadge.displayName = "SeriesBadge";
