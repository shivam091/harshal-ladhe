import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import GridTemplateBuilder from "@/components/GridTemplateBuilder";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "CSS Grid Template Builder";
const DESCRIPTION =
  "Visual grid-template-columns/rows/areas editor — a track list with px/rem/fr/auto/minmax() sizing, a click-and-drag named-areas painter that generates a real grid-template-areas string, a live CSS Grid preview, Holy Grail/Sidebar/Dashboard presets, and CSS/Tailwind/React code export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/css-grid-template-builder"
});

/*
  Static server component wrapper — GridTemplateBuilder itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function CssGridTemplateBuilderPage(): JSX.Element {
  return (
    <>
      <p>
        grid-template-columns, grid-template-rows, and grid-template-areas are the three
        properties that actually define a layout, but writing them by hand means keeping a mental
        model of a grid that doesn&apos;t exist yet. This builder makes the grid exist first: add
        column and row tracks with px, rem, fr, auto, or minmax() sizing, then click and drag
        directly across a preview grid to paint named areas — the areas string is generated from
        what you draw, not the other way around.
      </p>
      <p>
        The live preview renders the real CSS Grid your tracks and areas produce, so a track
        that&apos;s narrower than its content or an area that overlaps another one is visible
        immediately rather than discovered after pasting the code into a project. Holy Grail,
        Sidebar, and Dashboard presets give you a working layout to start editing from instead of
        an empty grid.
      </p>
      <p>
        Export straight to CSS, Tailwind, or a React component once the layout is right, copy a
        shareable permalink that encodes the exact state, or step back through edits with
        undo/redo. Your in-progress grid also autosaves locally, so a refresh or a closed tab
        won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the grid builder…</p>}>
        <GridTemplateBuilder />
      </Suspense>
    </>
  );
}
