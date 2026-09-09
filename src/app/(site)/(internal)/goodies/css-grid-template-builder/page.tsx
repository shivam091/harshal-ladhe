import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import GridTemplateBuilder from "@/components/GridTemplateBuilder";

const TITLE = "CSS Grid Template Builder";
const DESCRIPTION =
  "Visual grid-template-columns/rows/areas editor — a track list with px/rem/fr/auto/minmax() sizing, a click-and-drag named-areas painter that generates a real grid-template-areas string, a live CSS Grid preview, Holy Grail/Sidebar/Dashboard presets, and CSS/Tailwind/React code export.";

// Next.js page metadata — title/description reused across the base tags, OpenGraph, and Twitter card rather than duplicated three times.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/css-grid-template-builder" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/css-grid-template-builder",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — GridTemplateBuilder itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function GridTemplateBuilderPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the grid editor…</p>}>
        <GridTemplateBuilder />
      </Suspense>
    </>
  );
}
