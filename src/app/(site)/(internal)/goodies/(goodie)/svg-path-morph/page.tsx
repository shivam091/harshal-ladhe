import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import SvgPathMorph from "@/components/SvgPathMorph";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Shared by the page metadata and its OpenGraph/Twitter cards.
const TITLE = "SVG Path Morph";
// The search/share-card summary, leading with what the tool does rather than its shell.
const DESCRIPTION =
  "Morph between two or more SVG paths on an alchemist's workbench — any d string is normalised to cubics, subpaths padded, segments split by length and start points aligned, with a compatibility report, onion-skin preview and CSS, SMIL, react-spring and raw-path exports.";

// Canonical URL, OpenGraph and Twitter metadata, built the same way as every other goodie page.
export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/svg-path-morph"
});

/*
  Static server component wrapper — SvgPathMorph itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function SvgPathMorphPage(): JSX.Element {
  return (
    <>
      <p>
        Browsers will happily animate one path into another, but only when both share exactly the same
        list of commands. A circle drawn with arcs and a star drawn with straight lines don&apos;t, so the
        morph simply snaps. This workbench fixes that: paste any two <code>d</code> strings (relative or
        absolute, arcs and all) and it rewrites both as cubic béziers, pads out missing subpaths, and
        splits segments by length until the two match command for command.
      </p>
      <p>
        It then turns each shape&apos;s start point, and reverses its direction if that helps, so the points
        travel the shortest distance rather than twisting through each other. The compatibility report
        lists every change it made, and a manual offset lets you add a deliberate spin. Add more
        keyframes to chain several shapes together.
      </p>
      <p>
        Scrub the brass astrolabe, slow the preview down, switch on onion-skin ghosts and travel lines to
        see where every point goes, then copy the result as CSS <code>d: path()</code> keyframes or a
        transition (Chromium and Firefox), SMIL that runs in Safari too, a react-spring snippet, or the
        bare matched paths. Presets, undo/redo, a permalink and a local autosave are all included.
      </p>

      <Suspense fallback={<p>Lighting the burner…</p>}>
        <SvgPathMorph />
      </Suspense>
    </>
  );
}
