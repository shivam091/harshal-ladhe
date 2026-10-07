import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ShapeToPathConverter from "@/components/ShapeToPathConverter";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// The page title, shared by the metadata and the share text.
const TITLE = "Shape → Path Converter";

// One-sentence summary for search results and share previews.
const DESCRIPTION =
  "Convert <rect>, <circle>, <ellipse>, <line>, <polyline> and <polygon> into an equivalent <path d>, with a numbered step-by-step breakdown of every command, draggable handles, an overlay proving the two match, and whole-SVG conversion.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/shape-to-path"
});

/*
  Static server component wrapper. ShapeToPathConverter itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather
  than opting this whole route out of static rendering.
*/
export default function ShapeToPathPage(): JSX.Element {
  return (
    <>
      <p>
        Every one of SVG&apos;s basic shapes is shorthand for a path. A <code>&lt;rect&gt;</code> is
        four edges and, once <code>rx</code>/<code>ry</code> round it, four quarter-arcs; a{" "}
        <code>&lt;polygon&gt;</code> is a points list with automatic closure. If you have read{" "}
        <Link href="/post/svg/svg-essentials-mastering-basic-shapes">SVG Essentials: Mastering Shapes, Coordinates, and Styling</Link>, this is the
        next page of the same exercise book: pick a shape, set its attributes or drag its handles on
        the squared paper, and watch the equivalent <code>&lt;path d&gt;</code> get written out.
      </p>
      <p>
        The working is shown in full. Each command gets its own numbered line explaining where the
        pen moves and why: the top-left corner moved in by <code>rx</code>, a radius clamped to half
        the size, or why a circle needs two half-arcs rather than one. Hover a line to trace that
        segment in red, or step through the path one command at a time. The original shape and the
        generated path are drawn on top of each other, and their bounding boxes are checked, so you
        can see they really match.
      </p>
      <p>
        Switch between absolute and relative commands, choose how many decimal places to keep, or
        paste a whole SVG and have every basic shape in it converted in place, with its fills and
        strokes left alone. Start from a worked example, copy a permalink to your exercise, or step
        back through edits with undo/redo. Your work also autosaves locally, so a refresh or a
        closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Opening the exercise book…</p>}>
        <ShapeToPathConverter />
      </Suspense>
    </>
  );
}
