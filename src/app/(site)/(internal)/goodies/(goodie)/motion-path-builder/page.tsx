import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import MotionPathBuilder from "@/components/MotionPathBuilder";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Motion Path Builder";
const DESCRIPTION =
  "Lay a track on a model railway baseboard and send an element along it with real CSS offset-path — tune rotation, anchor, easing and timing on a train controller, then export CSS, SVG SMIL or a React component.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/motion-path-builder"
});

/*
  Static server component wrapper — MotionPathBuilder itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function MotionPathBuilderPage(): JSX.Element {
  return (
    <>
      <p>
        CSS can move an element along any curve you can draw. Give it an <code>offset-path</code>, animate{" "}
        <code>offset-distance</code> from one percentage to another, and the browser does the geometry — including turning the
        element to face along the line with <code>offset-rotate</code>. This builder lays that path out as track on a model
        railway baseboard: click the felt to pin down the line, drag the pins and their handles to bend it, or paste a{" "}
        <code>d</code> string from any SVG.
      </p>
      <p>
        The controller beside the layout sets the run: a speed dial for the duration, a direction switch for forward, reverse or
        shuttling back and forth, plus delay, repeats, heading, <code>offset-anchor</code> and how much of the line to use. Easing
        comes from the usual keywords or your own <code>cubic-bezier()</code>, and faint ghost locos along the track show where the
        element will be at equal slices of time, so you can see the easing before you press play.
      </p>
      <p>
        The preview runs on real <code>offset-path</code>, and you can play, pause or scrub it. Export the result as CSS, as an SVG
        with SMIL <code>&lt;animateMotion&gt;</code>, or as a React component. One thing to watch: offset-path coordinates are
        pixels in the element&apos;s containing block, while SMIL&apos;s live in the SVG&apos;s own user space and scale with it.
        Start from a preset, share a permalink, or step back with undo/redo. Your layout also autosaves locally.
      </p>

      <Suspense fallback={<p>Laying the track…</p>}>
        <MotionPathBuilder />
      </Suspense>
    </>
  );
}
