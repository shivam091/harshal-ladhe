import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import EasingCurveEditor from "@/components/EasingCurveEditor";

const TITLE = "Easing Curve Editor";
const DESCRIPTION =
  "Draggable cubic-bezier() timing-function editor with keyboard nudging, a slide/scale/opacity/rotate preview animation, presets drawn from the CSS Easing Functions guide, and CSS/Tailwind/React code output with shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/easing-curve-editor" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/easing-curve-editor",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — EasingCurveEditor itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function EasingCurveEditorPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the curve editor…</p>}>
        <EasingCurveEditor />
      </Suspense>
    </>
  );
}
