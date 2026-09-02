import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import TriangleGenerator from "@/components/TriangleGenerator";

const TITLE = "CSS Triangle / Arrow Generator";
const DESCRIPTION =
  "Triangle and chevron/arrow shape generator comparing two CSS techniques side by side — the classic 0×0 border trick and clip-path polygon() — with direction, size, and color controls, plus real-world tooltip/breadcrumb/carousel-arrow presets and CSS/Tailwind/React code export.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/triangle-generator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/triangle-generator",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — TriangleGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function TriangleGeneratorPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the shape editor…</p>}>
        <TriangleGenerator />
      </Suspense>
    </>
  );
}
