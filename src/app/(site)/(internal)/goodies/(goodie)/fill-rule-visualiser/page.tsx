import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import FillRuleVisualiser from "@/components/FillRuleVisualiser";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Shared by the page metadata and share previews — the visible <h1> comes from the goodies registry via the segment layout.
const TITLE = "Fill-Rule Visualiser";
// Search/share-preview summary; mirrors the goodies registry blurb.
const DESCRIPTION =
  "Stained-glass fill-rule visualiser — draw or paste a self-crossing SVG path, compare nonzero and evenodd side by side, split or overlaid, cast a ray to see every ±1 crossing, the winding number and the crossing count, tint regions with a winding map, reverse subpaths to open or close holes, and export SVG, CSS, clip-path and JSX.";

// Standard goodie metadata — no cover image yet, so the shared default share card is used.
export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/fill-rule-visualiser"
});

/*
  Static server component wrapper — FillRuleVisualiser itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather
  than opting this whole route out of static rendering.
*/
export default function FillRuleVisualiserPage(): JSX.Element {
  return (
    <>
      <p>
        When a path crosses itself, or one subpath sits inside another, the browser has to decide
        which of the enclosed regions count as &ldquo;inside&rdquo;. It does that by casting a ray
        from each point out to infinity and looking at the edges it crosses. Under{" "}
        <code>nonzero</code>, an edge drawn one way adds 1 and an edge drawn the other way takes 1
        away, and any total but zero is filled. Under <code>evenodd</code>, direction doesn&apos;t
        matter: an odd number of crossings is filled, an even number is left empty. This visualiser
        is the hands-on version of the ray diagram in{" "}
        <Link href="/post/svg/polygon-vs-polyline">SVG Polygon vs Polyline: Differences, Fill Rules, and Use Cases</Link>.
      </p>
      <p>
        The path is laid out like a stained-glass window on a light table: the outline is leaded
        came, filled regions are coloured glass and empty ones stay clear. Click anywhere to cast a
        laser plumb line from that point (hover to preview it, drag the red knob to aim it) and every
        crossing shows the edge&apos;s drawing direction and its <code>+1</code> or <code>−1</code>,
        while the bench notes keep the running winding number for nonzero and a tally of crossings
        for evenodd. Switch on the winding map to tint every region by its winding number.
      </p>
      <p>
        Draw your own path point by point, drag or arrow-key the points into place, add subpaths for
        holes, or paste a <code>d</code> string. Reversing an inner subpath is the quickest way to
        see why the counter of a letter drawn the same way as its outline fills in under nonzero.
        Start from a preset, undo and redo freely, share a permalink, and export the result as SVG,
        CSS <code>fill-rule</code>/<code>clip-rule</code>, <code>clip-path: path()</code> or JSX.
        Your work also autosaves locally.
      </p>

      <Suspense fallback={<p>Loading the fill-rule visualiser…</p>}>
        <FillRuleVisualiser />
      </Suspense>
    </>
  );
}
