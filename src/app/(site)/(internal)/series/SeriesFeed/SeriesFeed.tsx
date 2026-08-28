"use client";

import type { JSX } from "react";
import SeriesList from "@/components/SeriesList";
import Button from "@/components/Button";
import IconArrowDown from "@/icons/IconArrowDown";
import { useShowMore } from "@/hooks/use-show-more";
import { siteConfig } from "@/config/site";
import type { SeriesListProps } from "@/interfaces/series";
import { ShowMoreWrapper } from "@/app/(site)/(internal)/series/SeriesFeed/SeriesFeed.styles";

/*
  Client wrapper around SeriesList that reveals series in batches via the shared
  useShowMore hook, using siteConfig.pagination's shared batch sizes. The trigger is
  a boxed-icon Button — see Button.tsx's iconVariant="boxed".
*/
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
