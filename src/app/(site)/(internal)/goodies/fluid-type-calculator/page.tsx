import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import FluidTypeCalculator from "@/components/FluidTypeCalculator";

const TITLE = "Fluid Type Calculator";
const DESCRIPTION =
  "Min/max viewport → clamp() font-size calculator — an arbitrary list of named steps (H1, Body, …), a draggable viewport-width preview simulating real fluid scaling, and CSS custom-property/Tailwind theme/React style-object export with shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/fluid-type-calculator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/fluid-type-calculator",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — FluidTypeCalculator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function FluidTypeCalculatorPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the calculator…</p>}>
        <FluidTypeCalculator />
      </Suspense>
    </>
  );
}
