import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import SvgOptimiser from "@/components/SvgOptimiser";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Page heading and metadata title.
const TITLE = "SVG Optimiser";

// Metadata description — what the tool does in one sentence.
const DESCRIPTION =
  "Paste, drop or upload an SVG and weigh it before and after an SVGO-style clean-up — fifteen switchable passes, each showing the bytes it saved, with a gzip estimate, sanitised before/after previews, a line diff and a ready-to-download file.";

// Built once at module level, as every goodie route does.
export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/svg-optimiser"
});

/*
  Static server component wrapper — SvgOptimiser itself is the client component that reads
  `?state=` via useSearchParams (and parses SVG with the browser's DOMParser), which Next.js
  requires to sit inside a Suspense boundary rather than opting this whole route out of static
  rendering.
*/
export default function SvgOptimiserPage(): JSX.Element {
  return (
    <>
      <p>
        An SVG saved from a design tool carries a surprising amount of luggage: an XML prolog,
        editor namespaces and metadata, ids nobody references, groups that group nothing, colours
        spelt the long way round, and coordinates to eight decimal places that no screen will ever
        resolve. None of it changes what you see, but all of it goes over the wire.
      </p>
      <p>
        This counter weighs your SVG, runs it through fifteen hand-written optimisation passes —
        stripping editor cruft, rounding numbers, shortening colours, turning simple shapes into
        paths and rewriting path data in its shortest absolute or relative form — and weighs it
        again. Each pass is a postage stamp you can peel off, and each stamp shows exactly how many
        bytes it saved (or would still save), alongside a gzip estimate from your browser.
      </p>
      <p>
        Both parcels are previewed side by side as sandboxed images, with scripts, event handlers
        and <code>javascript:</code> links held back, so you can check nothing visible changed. Flip
        to the diff to see what went, then copy or download the result, or copy a permalink to
        this exact parcel — your work also autosaves locally, so a refresh won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Opening the parcel counter…</p>}>
        <SvgOptimiser />
      </Suspense>
    </>
  );
}
