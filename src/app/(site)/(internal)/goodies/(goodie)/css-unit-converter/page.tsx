import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import UnitConverter from "@/components/UnitConverter";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Shared by the page metadata and nowhere else — kept as a const so the title and its OpenGraph copy can't drift apart.
const TITLE = "CSS Unit Converter";

// Doubles as the meta description and the share-card summary, so it leads with what the tool converts.
const DESCRIPTION =
  "Bidirectional px ⇄ rem/em/vw/vh/cqi/%/pt converter with editable root, parent, viewport and container context, a true-scale measuring tape, batch spacing-scale conversion, and CSS/Tailwind/Sass/JS export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/css-unit-converter"
});

/*
  Static server component wrapper — UnitConverter itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function CssUnitConverterPage(): JSX.Element {
  return (
    <>
      <p>
        Converting px to rem is one division, but only if you know what you&apos;re dividing by —
        and every relative unit divides by something different. rem looks at the root, em at the
        parent (and compounds), vw and vh at the viewport, cqi at the nearest query container, and %
        at whatever the property happens to measure against. This converter makes all of that
        context editable: type a value in any unit and every other row updates live, both ways.
      </p>
      <p>
        A tailor&apos;s measuring tape underneath draws the length at true CSS px, with a parallel
        ruler for each unit, so you can see where 1rem, 1vw and 1cqi fall against one another rather
        than holding the ratios in your head. Drag the tab to pull the tape out, or focus it and use
        the arrow keys. Presets cover the browser default, the 62.5% root trick, common mobile and
        desktop viewports, and a narrow card container.
      </p>
      <p>
        Batch mode converts a whole spacing scale at once and exports it as CSS custom properties, a
        Tailwind spacing extension, or a Sass or JS helper function with your context baked in as
        its default. Choose how many decimal places you want, copy a permalink that encodes the exact
        state, or step back through edits with undo/redo — your work also autosaves locally.
      </p>

      <Suspense fallback={<p>Loading the unit converter…</p>}>
        <UnitConverter />
      </Suspense>
    </>
  );
}
