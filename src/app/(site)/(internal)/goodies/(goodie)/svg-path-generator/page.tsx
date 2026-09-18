import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import SvgPathGenerator from "@/components/SvgPathGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "SVG Path Generator";
const DESCRIPTION =
  "Draggable pen-tool path editor with open/closed strokes, bezier curve points, stroke/fill styling, and raw <path d>, standalone SVG, and React code export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/svg-path-generator"
});

/*
  Static server component wrapper — SvgPathGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function SvgPathGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        An SVG <code>d</code> attribute is a compact string of move/line/curve commands that reads
        like coordinates, not like a shape — hand-writing one means simulating a pen tool in your
        head. This editor puts the pen tool back where it belongs: click to place anchor points,
        drag out bezier handles to curve a segment, and close the path when you&apos;re done. The{" "}
        <code>d</code> string is generated from what you draw.
      </p>
      <p>
        Stroke and fill styling apply live on the same preview, so a path meant to be a solid icon
        versus an open, stroked line looks right before it&apos;s exported — no guessing how{" "}
        <code>fill-rule</code> or <code>stroke-linejoin</code> will render until it&apos;s pasted
        somewhere else.
      </p>
      <p>
        Export straight to a raw <code>path d</code> string, a standalone SVG document, or a React
        component once the path is right, copy a shareable permalink that encodes the exact state,
        or step back through edits with undo/redo. Your in-progress path also autosaves locally, so
        a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the path editor…</p>}>
        <SvgPathGenerator />
      </Suspense>
    </>
  );
}
