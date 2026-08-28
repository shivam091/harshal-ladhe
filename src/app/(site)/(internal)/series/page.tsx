import type { JSX } from "react";
import type {Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import SeriesFeed from "@/app/(site)/(internal)/series/SeriesFeed";
import { getSortedSeriesWithDates } from "@/lib/series";
import { SeriesSection } from "@/app/(site)/(internal)/series/series.styles";

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
  Renders the series index — every series newest-first by publish date, each card
  showing title, excerpt, description, and its part count.
*/
export default function SeriesPage(): JSX.Element {
  const series = getSortedSeriesWithDates();

  return (
    <>
      <SeriesSection aria-labelledby="series-list-title">
        <VisuallyHidden as="h2" id="series-list-title">
          List of series
        </VisuallyHidden>

        <p>{metadata.description as string}</p>

        <SeriesFeed series={series} />
      </SeriesSection>
    </>
  );
}
