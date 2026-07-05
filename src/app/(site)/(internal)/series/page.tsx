import type { JSX } from "react";
import type {Metadata } from "next";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getSortedSeries } from "@/data/series";
import {
  SeriesSection,
  SeriesList,
  SeriesCard,
  SeriesCardHeader,
  SeriesCardTitle,
  SeriesCardExcerpt,
  SeriesCardBody,
  SeriesCardDescription,
  SeriesCardFooter
} from "@/app/(site)/(internal)/series/series.styles";
import { BookOpenIcon } from "@/components/Icon";
import { PageMetaItem } from "@/components/PageMeta/PageMeta.styles";

export const metadata: Metadata = {
  title: "Series",
  description: "Follow structured learning series covering JavaScript, CSS Grid, animations, and modern web design. Step-by-step guides to mastering each topic with clarity and depth.",
  alternates: { canonical: "/series" },
  openGraph: {
    title: "Series",
    description: "Follow structured learning series covering JavaScript, CSS Grid, animations, and modern web design. Step-by-step guides to mastering each topic with clarity and depth.",
    url: "/series",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Series",
    description: "Follow structured learning series covering JavaScript, CSS Grid, animations, and modern web design. Step-by-step guides to mastering each topic with clarity and depth."
  }
};

/*
  Renders the series index — every series sorted by curated order, each card
  showing title, excerpt, description, and its part count.
*/
export default function SeriesPage(): JSX.Element {
  const series = getSortedSeries();

  return (
    <>
      <SeriesSection aria-labelledby="series-list-title">
        <VisuallyHidden as="h2" id="series-list-title">
          List of series
        </VisuallyHidden>

        <p>{metadata.description as string}</p>

        <SeriesList>
          {series.map((item) => {
            const partCount = item.parts.length;

            return (
              <SeriesCard key={item.slug}>
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
              </SeriesCard>
            );
          })}
        </SeriesList>
      </SeriesSection>
    </>
  );
}
