import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import LayoutPlayground from "@/components/LayoutPlayground";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Layout Playground";
const DESCRIPTION =
  "Blueprint-drafted Flexbox/Grid playground — toggle between layout modes, tune every container and per-item property live, read gaps and alignment straight off an annotated technical drawing, start from a curated preset, and export to CSS, Tailwind, or React.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/layout-playground/cover.png",
  width: 1536,
  height: 1024,
  alt: "A cyanotype blueprint cover image for a Layout Playground, featuring a live Flexbox/Grid preview rendered as a hand-drafted technical drawing with cross-hatched item boxes, corner tick marks, and engineering dimension lines calling out the gaps between them, alongside a parts-schedule item list and CSS/Tailwind/React export."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/layout-playground",
  image: IMAGE
});

/*
  Static server component wrapper — LayoutPlayground itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function LayoutPlaygroundPage(): JSX.Element {
  return (
    <>
      <p>
        Flexbox and CSS Grid are both fundamentally about spatial arrangement, so this editor treats
        the layout under edit like an architect&apos;s own drafting table. Switch between the two
        layout modes at any time, then tune every container-level property — direction, wrap,
        justify/align content, gap, grid track sizes, auto-flow — alongside per-item overrides like
        flex-grow/order or grid-column/grid-row placement, all compiled live.
      </p>
      <p>
        The live preview itself renders as an annotated technical drawing rather than a plain box
        model: every item is drawn as a cross-hatched, corner-ticked rectangle, and the real,
        measured gap between each pair of visually adjacent items is called out with an engineering
        dimension line and its exact pixel value, so <code>gap</code>, <code>justify-content</code>,
        and <code>align-items</code> read as genuine spatial measurements instead of abstract CSS
        keywords. A parts-schedule list catalogs every item the same way a real drawing&apos;s own
        corner table does, and a curated preset gallery jumps straight to a finished layout — a
        navbar, a holy-grail grid, a photo gallery, and more.
      </p>
      <p>
        Once a layout is dialed in, export it straight into CSS, a Tailwind-class markup snippet, or
        a pair of React style objects, copy a shareable permalink that encodes the exact layout, or
        step back through edits with undo/redo. Your in-progress layout also autosaves locally, so a
        refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the layout playground…</p>}>
        <LayoutPlayground />
      </Suspense>
    </>
  );
}
