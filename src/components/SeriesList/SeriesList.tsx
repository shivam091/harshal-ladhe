import type { JSX } from "react";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { BookOpenIcon } from "@/components/Icon";
import type { SeriesListProps } from "@/components/SeriesList/SeriesList.types";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";
import {
  SeriesFeed,
  SeriesPreview,
  SeriesCardHeader,
  SeriesCardTitle,
  SeriesCardExcerpt,
  SeriesCardBody,
  SeriesCardDescription,
  SeriesCardFooter
} from "@/components/SeriesList/SeriesList.styles";

// The /series feed: one card per series with title, excerpt, description, and part count.
export default function SeriesList({ series }: SeriesListProps): JSX.Element {
  return (
    <>
      <SeriesFeed>
        {series.map((item) => {
          const partCount = item.parts.length;

          return (
            <SeriesPreview key={item.slug}>
              <SeriesCardHeader>
                <SeriesCardTitle>
                  <Link
                    href={`/series/${item.slug}`}
                    title={item.title}
                    aria-label={`View parts of series: ${item.title}`}
                  >
                    {item.title}
                  </Link>
                </SeriesCardTitle>

                {item.excerpt && <SeriesCardExcerpt>{item.excerpt}</SeriesCardExcerpt>}
              </SeriesCardHeader>

              {item.description && (
                <SeriesCardBody>
                  <SeriesCardDescription title={item.description}>
                    {item.description}
                  </SeriesCardDescription>
                </SeriesCardBody>
              )}

              <SeriesCardFooter>
                <PageMetaItem className="series-parts">
                  <BookOpenIcon />
                  <VisuallyHidden>Parts:</VisuallyHidden>
                  {partCount} part{partCount !== 1 ? "s" : ""}
                </PageMetaItem>
              </SeriesCardFooter>
            </SeriesPreview>
          );
        })}
      </SeriesFeed>
    </>
  );
}

SeriesList.displayName = "SeriesList";
