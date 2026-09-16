import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import BorderRadiusGenerator from "@/components/BorderRadiusGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Border Radius Generator";
const DESCRIPTION =
  "Clay-studio border-radius editor — pinch each corner's radius by dragging directly on the shape or typing exact values, jump between quick shapes from sharp to pill, circle, blob, and squircle, tune the clay and worktable colors, and export straight to CSS, Tailwind, or React.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/border-radius-generator/cover.png",
  width: 1536,
  height: 1024,
  alt: "A warm clay-studio cover image for a Border Radius Generator, featuring a soft lump of clay resting on a worktable with round pinch-point handles at each corner, a row of small clay-lump swatches shaped like sharp, rounded, pill, circle, blob, and squircle corners, and CSS/Tailwind/React export."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/border-radius-generator",
  image: IMAGE
});

/*
  Static server component wrapper — BorderRadiusGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function BorderRadiusGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        A CSS <code>border-radius</code> is really just how sharp or soft a corner reads — from a
        crisp right angle all the way to a fully organic blob — so this editor treats the shape
        under edit like a literal lump of clay sitting on a worktable. Each of its four corners gets
        its own round pinch-point handle you can drag right on the shape, or type an exact
        horizontal/vertical radius into the numeric fields beside it, with a toggle to lock every
        corner to one shared value for the common &quot;just round the whole box&quot; case.
      </p>
      <p>
        A row of quick shape lumps jumps straight to a named silhouette — sharp, rounded, pill,
        circle, blob, or squircle — the last two spanning what a plain elliptical
        <code>border-radius</code> can and can&apos;t do: squircle mode instead compiles a sampled
        superellipse into <code>clip-path</code>, a true continuous-curvature corner. A curated
        preset shelf swaps in whole finished pieces — shape, clay color, and worktable color all at
        once — and the clay/worktable colors and reference size are also tunable on their own.
      </p>
      <p>
        Once a shape is dialed in, export it straight into a CSS declaration, a Tailwind
        arbitrary-property class, or a React inline style object, copy a shareable permalink that
        encodes the exact shape, or step back through edits with undo/redo. Your in-progress shape
        also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the border radius editor…</p>}>
        <BorderRadiusGenerator />
      </Suspense>
    </>
  );
}
