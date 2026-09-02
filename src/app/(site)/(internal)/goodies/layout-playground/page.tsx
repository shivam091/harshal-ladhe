import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import LayoutPlayground from "@/components/LayoutPlayground";

const TITLE = "Grid / Flexbox Playground";
const DESCRIPTION =
  "Live CSS Grid and Flexbox editor — container-level controls (direction, wrap, alignment, editable grid tracks, auto-flow), per-item controls (order, grow/shrink/basis or column/row placement and spanning), a Holy Grail layout preset, and CSS/Tailwind/React code output with shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/layout-playground" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/layout-playground",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — LayoutPlayground itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function LayoutPlaygroundPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the layout editor…</p>}>
        <LayoutPlayground />
      </Suspense>
    </>
  );
}
