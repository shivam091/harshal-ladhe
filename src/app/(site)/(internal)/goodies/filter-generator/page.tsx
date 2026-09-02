import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import FilterGenerator from "@/components/FilterGenerator";

const TITLE = "Filter Generator";
const DESCRIPTION =
  "CSS filter and backdrop-filter editor — blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia, and drop-shadow, a glassmorphism preset, and a live preview over a vivid gradient or photo, with CSS/Tailwind/React code output and shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/filter-generator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/filter-generator",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — FilterGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function FilterGeneratorPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the filter editor…</p>}>
        <FilterGenerator />
      </Suspense>
    </>
  );
}
