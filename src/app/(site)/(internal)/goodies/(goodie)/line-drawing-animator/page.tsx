import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import LineDrawingAnimator from "@/components/LineDrawingAnimator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Line-Drawing / Signature Animator";
const DESCRIPTION =
  "Paste any SVG and watch every stroke draw itself on in sequence: order by position, length or a seeded shuffle, pace strokes at a constant pen speed, fade fills in afterwards, and export animated SVG, CSS, React or Web Animations code.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/line-drawing-animator"
});

/*
  Static server component wrapper — LineDrawingAnimator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function LineDrawingAnimatorPage(): JSX.Element {
  return (
    <>
      <p>
        The &ldquo;self-drawing&rdquo; line effect is one of the oldest tricks in SVG animation: give a
        stroke a dash exactly as long as the stroke itself, push that dash out of view with{" "}
        <code>stroke-dashoffset</code>, then animate the offset back to zero. Doing it by hand for a
        whole drawing, though, means measuring every path and juggling a delay for each one. Paste an
        SVG here, or drop a file onto the ink well, and every path, line, polyline, polygon, rect,
        circle and ellipse is found, measured with <code>getTotalLength()</code> and written out in
        sequence.
      </p>
      <p>
        Choose the order (document, reverse, left to right, top to bottom, longest first, or a
        seeded shuffle), a fixed time per stroke or &ldquo;signature&rdquo; mode, where duration follows
        length so the pen moves at a constant speed, plus the pause between strokes, how much they
        overlap, the easing, and colour or width overrides. Shapes that are only filled can be
        outlined first and have their fill fade in afterwards. The stroke ledger lets you reorder
        strokes by dragging or with Alt and the arrow keys, leave any out, or tweak one on its own.
      </p>
      <p>
        When it looks right, take it away as a self-contained animated SVG, a stylesheet with the
        classes listed, a React component, or a Web Animations API script. Every export respects{" "}
        <code>prefers-reduced-motion</code>, and so does the page: with reduced motion on, it shows
        the finished drawing rather than playing it. Pasted markup is sanitised, so scripts, event
        handlers and <code>javascript:</code> links are removed before anything is rendered. Your
        work autosaves locally, undo and redo cover every edit, and a permalink carries the drawing
        and its settings.
      </p>

      <Suspense fallback={<p>Loading the line drawing animator…</p>}>
        <LineDrawingAnimator />
      </Suspense>
    </>
  );
}
