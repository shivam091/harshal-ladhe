"use client";

import type { JSX } from "react";
import SeriesList from "@/components/SeriesList";
import Button from "@/components/Button";
import IconArrowDown from "@/icons/IconArrowDown";
import { useShowMore } from "@/hooks/use-show-more";
import { siteConfig } from "@/config/site";
import type { SeriesListProps } from "@/components/SeriesList/SeriesList.types";
import { ShowMoreWrapper } from "@/app/(site)/(internal)/series/SeriesFeed/SeriesFeed.styles";

// Reveals series in batches so a long feed doesn't render all at once, using the site-wide batch sizes.
export default function SeriesFeed({ series }: SeriesListProps): JSX.Element {
  const { visibleItems, hasMore, isLoading, showMore } = useShowMore(series, siteConfig.pagination);

  return (
    <>
      <SeriesList series={visibleItems} />

      {hasMore && (
        <ShowMoreWrapper>
          <Button
            type="button"
            iconVariant="boxed"
            iconLeft={<IconArrowDown size={18} />}
            loading={isLoading}
            onClick={showMore}
          >
            Show more
          </Button>
        </ShowMoreWrapper>
      )}
    </>
  );
}

SeriesFeed.displayName = "SeriesFeed";
