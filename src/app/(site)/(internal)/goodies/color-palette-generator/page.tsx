import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import ColorPaletteGenerator from "@/components/ColorPaletteGenerator";

const TITLE = "Color Palette & Contrast Checker";
const DESCRIPTION =
  "WCAG 2.x contrast checker (ratio, AA/AAA pass/fail for normal and large text) plus a shade/tint ramp generator from a single seed color — perceptually-uniform OKLCH steps or a naive RGB-mix ramp for comparison — with CSS custom-property/Tailwind/React export and shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/color-palette-generator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/color-palette-generator",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — ColorPaletteGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function ColorPaletteGeneratorPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the palette tool…</p>}>
        <ColorPaletteGenerator />
      </Suspense>
    </>
  );
}
