import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import FluidTypeCalculator from "@/components/FluidTypeCalculator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Fluid Type Calculator";
const DESCRIPTION =
  "Min/max viewport → clamp() font-size calculator with an arbitrary list of named steps, a draggable viewport-width live preview, and CSS custom-property/Tailwind/React export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/fluid-type-calculator"
});

/*
  Static server component wrapper — FluidTypeCalculator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function FluidTypeCalculatorPage(): JSX.Element {
  return (
    <>
      <p>
        A fluid clamp() font-size is three numbers — a minimum, a maximum, and a viewport-relative
        middle term — and getting that middle term right by hand means solving a small linear
        equation for every single type step. This calculator does the math: set a min and max
        viewport width once, add as many named steps as your scale needs, and each one&apos;s
        clamp() is derived automatically.
      </p>
      <p>
        The live preview renders every step at once and includes a draggable viewport-width
        handle, so you can drag from the min viewport to the max and watch each size scale in
        real time — the same thing you&apos;d otherwise have to resize your actual browser window
        to check.
      </p>
      <p>
        Export the whole scale as CSS custom properties, Tailwind theme values, or a React object
        once it&apos;s right, copy a shareable permalink that encodes the exact state, or step
        back through edits with undo/redo. Your in-progress scale also autosaves locally, so a
        refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the type calculator…</p>}>
        <FluidTypeCalculator />
      </Suspense>
    </>
  );
}
