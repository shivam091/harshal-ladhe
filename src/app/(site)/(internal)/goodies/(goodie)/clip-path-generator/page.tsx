import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import ClipPathGenerator from "@/components/ClipPathGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Clip-Path Generator";
const DESCRIPTION =
  "Draggable clip-path editor with pen-tool bezier points, circle/ellipse/inset shapes, a two-shape morph with ready @keyframes export, CSS/Tailwind/React/SVG code output, and shareable permalinks.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/clip-path-generator"
});

/*
  Static server component wrapper — ClipPathGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function ClipPathGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        clip-path is one of the few CSS properties where the syntax genuinely gets in the way of
        the shape you&apos;re picturing — a polygon() of hand-typed percentage pairs doesn&apos;t
        look like the cut it produces until it renders. This editor works the other way around:
        drag pen-tool points directly on the preview, or switch to a circle, ellipse, or inset
        shape with its own draggable handles, and the clip-path value is generated from what you
        see, not typed blind.
      </p>
      <p>
        Once a shape exists, morph is a second shape entirely — set a start and end path and the
        tool interpolates between them point for point, exporting a ready @keyframes block so the
        transition works the moment it&apos;s pasted in, not just in the preview.
      </p>
      <p>
        Export straight to CSS, Tailwind, React, or raw SVG once the shape is right, copy a
        shareable permalink that encodes the exact state, or step back through edits with
        undo/redo. Your in-progress shape also autosaves locally, so a refresh or a closed tab
        won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the shape editor…</p>}>
        <ClipPathGenerator />
      </Suspense>
    </>
  );
}
