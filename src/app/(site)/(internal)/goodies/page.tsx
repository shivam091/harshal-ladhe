import type { JSX } from "react";
import type {Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import { goodies } from "@/data/goodies";
import GoodieCard from "@/app/(site)/(internal)/goodies/GoodieCard";
import { GoodiesSection, GoodiesList } from "@/app/(site)/(internal)/goodies/goodies.styles";

export const metadata: Metadata = {
  title: "Goodies",
  description:
    "Curated collection of developer-friendly goodies — tools, libraries, code utilities, and visual references for JavaScript, CSS, SVG, and web animation enthusiasts.",
  alternates: { canonical: "/goodies" },
  openGraph: {
    title: "Goodies",
    description:
      "Curated collection of developer-friendly goodies — tools, libraries, code utilities, and visual references for JavaScript, CSS, SVG, and web animation enthusiasts.",
    url: "/goodies",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Goodies",
    description:
      "Curated collection of developer-friendly goodies — tools, libraries, code utilities, and visual references for JavaScript, CSS, SVG, and web animation enthusiasts."
  }
};

// Data-driven so adding a goodie means editing only the goodies array, never this page.
export default function GoodiesPage(): JSX.Element {
  return (
    <>
      <GoodiesSection aria-labelledby="goodies-list-title">
        <VisuallyHidden as="h2" id="goodies-list-title">
          Goodies
        </VisuallyHidden>

        <p>
          Explore a collection of interactive tools, visual demos, and handy snippets built to
          enhance your workflow and creativity. From gradient and shadow palette generators to live
          code snippets, SVG clocks, and other experimental widgets — each goodie is crafted for
          developers and designers who love to learn by tinkering.
        </p>

        <GoodiesList>
          {goodies.map((goodie) => (
            <GoodieCard key={goodie.name} goodie={goodie} />
          ))}
        </GoodiesList>
      </GoodiesSection>
    </>
  );
}
