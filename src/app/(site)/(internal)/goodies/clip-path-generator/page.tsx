import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import ClipPathGenerator from "@/components/ClipPathGenerator";

const TITLE = "Clip-Path Generator";
const DESCRIPTION =
  "Draggable clip-path editor with pen-tool bezier points, circle/ellipse/inset shapes, a two-shape morph with ready @keyframes export, CSS/Tailwind/React/SVG code output, and shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/clip-path-generator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/clip-path-generator",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — ClipPathGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function ClipPathGeneratorPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the shape editor…</p>}>
        <ClipPathGenerator />
      </Suspense>
    </>
  );
}
