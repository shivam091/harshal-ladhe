import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Badge from "@/components/Badge";
import { BookIcon } from "@/components/Icon";
import type { SeriesBadgeProps } from "@/components/SeriesBadge/SeriesBadge.types";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";

// Shows at a glance that a post belongs to a series and where it sits, so readers can start from part one.
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
