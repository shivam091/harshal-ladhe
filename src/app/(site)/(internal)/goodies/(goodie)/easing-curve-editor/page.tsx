import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import EasingCurveEditor from "@/components/EasingCurveEditor";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Easing Curve Editor";
const DESCRIPTION =
  "Draggable cubic-bezier() editor with a slide/scale/opacity/rotate preview animation, presets from the CSS Easing Functions guide, and CSS/Tailwind/React code export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/easing-curve-editor"
});

/*
  Static server component wrapper — EasingCurveEditor itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function EasingCurveEditorPage(): JSX.Element {
  return (
    <>
      <p>
        A cubic-bezier() value is four numbers that don&apos;t look like a curve until they
        animate — ease-in-out and a jarring linear-feeling overshoot can differ by a decimal point
        you&apos;d never catch reading the raw value. This editor plots the curve on a scope-style
        graph: drag either control-point handle and both the trace and the timing-function value
        update together, live.
      </p>
      <p>
        A preview animation runs the curve against a real element — sliding, scaling, fading, or
        rotating — so the shape on the graph and the motion it produces stay connected the whole
        time you&apos;re editing, not just something you have to imagine. Presets pulled from the
        CSS Easing Functions guide give you a known-good starting curve for common motion feels.
      </p>
      <p>
        Export straight to CSS, Tailwind, or a React component once the curve feels right, copy a
        shareable permalink that encodes the exact state, or step back through edits with
        undo/redo. Your in-progress curve also autosaves locally, so a refresh or a closed tab
        won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the curve editor…</p>}>
        <EasingCurveEditor />
      </Suspense>
    </>
  );
}
