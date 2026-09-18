import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import TriangleGenerator from "@/components/TriangleGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "CSS Triangle / Arrow Generator";
const DESCRIPTION =
  "Triangle and chevron/arrow shapes comparing two CSS techniques side by side — the classic border trick and clip-path polygon() — with direction/size/color controls and real-world tooltip/breadcrumb/carousel-arrow presets.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/triangle-generator"
});

/*
  Static server component wrapper — TriangleGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function TriangleGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        A CSS triangle can be built two very different ways — a zero-width, zero-height box with
        three transparent borders and one visible one, or a solid box clipped with a clip-path
        polygon() — and the two produce identical-looking output from completely different rules.
        This generator builds both from the same direction, size, and color controls, so you can
        compare the actual markup and pick whichever fits the rest of your code.
      </p>
      <p>
        Direction covers all four cardinal points plus diagonals, and size and color apply to both
        techniques identically, so switching between them mid-edit never means starting over.
        Real-world presets — a speech-bubble tooltip nub, a breadcrumb chevron, a carousel arrow —
        give you a working shape tuned for its actual use case instead of a generic triangle.
      </p>
      <p>
        Export straight to CSS, Tailwind, or React once the shape is right, copy a shareable
        permalink that encodes the exact state, or step back through edits with undo/redo. Your
        in-progress shape also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the shape generator…</p>}>
        <TriangleGenerator />
      </Suspense>
    </>
  );
}
