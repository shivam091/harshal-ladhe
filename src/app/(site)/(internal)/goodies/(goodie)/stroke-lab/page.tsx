import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import StrokeLab from "@/components/StrokeLab";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Shared by the page metadata and share previews — the visible <h1> comes from the goodies registry via the segment layout.
const TITLE = "Stroke Lab";
// Search/share-preview summary; mirrors the goodies registry blurb.
const DESCRIPTION =
  "Haberdashery-styled SVG stroke lab — every stroke property live on a zig-zag, star, spiral, curve, text or custom path, with a measuring-tape dasharray editor, marching ants, cap and miter overlays, a miterlimit seam gauge, paint-order and non-scaling-stroke demos, and a pathLength draw-on export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/stroke-lab"
});

/*
  Static server component wrapper — StrokeLab itself is the client component that reads `?state=`
  via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than opting
  this whole route out of static rendering.
*/
export default function StrokeLabPage(): JSX.Element {
  return (
    <>
      <p>
        An SVG stroke is a ribbon of paint centred on the geometry, and nearly a dozen properties
        decide how that ribbon is cut, stitched and finished: where it starts and stops, what happens
        at every corner, whether it&apos;s solid or dashed, and whether it sits over or under the fill.
        This lab lays them all out on one cutting cloth, applied for real to a zig-zag, a star, a
        spiral, an open curve, a line of text, or any path data you paste in.
      </p>
      <p>
        The overlays show what the properties don&apos;t: a chalked centreline marking where the
        geometry sits inside the stroke, hatched caps measuring the <code>w/2</code> that round and
        square ends add past the path, and a miter spike on every corner. The seam gauge reads each
        corner&apos;s miter ratio, <code>1 / sin(θ / 2)</code>, and shows exactly which ones{" "}
        <code>stroke-miterlimit</code> turns into bevels. Dash patterns are edited on a measuring
        tape, odd-length lists and all, and can march along the path. For the shapes and attributes
        underneath, see{" "}
        <Link href="/post/svg/svg-essentials-mastering-basic-shapes">SVG Essentials: Mastering Shapes, Coordinates, and Styling</Link> and{" "}
        <Link href="/post/svg/svg-essentials-mastering-the-path-element">SVG Essentials: Mastering the Path Element</Link>.
      </p>
      <p>
        The draw-on panel turns the current stroke into the classic self-drawing line, using{" "}
        <code>pathLength=&quot;1&quot;</code> so no <code>getTotalLength()</code> measuring is ever
        needed, and exports it as CSS, a standalone SVG or a React component, each with a
        reduced-motion fallback. The technique is covered in depth in{" "}
        <Link href="/post/animations/svg-transitions-and-keyframes">Animating SVG: A Guide to CSS Transitions and Keyframes</Link>.
        Start from a preset in the pattern drawer, copy a permalink, undo and redo freely, and your
        work autosaves locally.
      </p>

      <Suspense fallback={<p>Laying out the stroke lab…</p>}>
        <StrokeLab />
      </Suspense>
    </>
  );
}
