import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import GradientGenerator from "@/components/GradientGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Gradient Generator";
const DESCRIPTION =
  "Live gradient builder — drag a large angle dial or position pad to shape a linear, radial, or conic gradient, edit multiple color stops with OKLCH/HSL/RGB interpolation, and export straight to CSS, Tailwind, or React.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/gradient-generator/cover.png",
  width: 1536,
  height: 1024,
  alt: "A vivid cover image for a Gradient Generator, featuring a full-bleed live gradient backdrop with glassmorphic control panels floating on top: a large draggable angle dial, a multi-stop color bar, and CSS/Tailwind/React export."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/gradient-generator",
  image: IMAGE
});

/*
  Static server component wrapper — GradientGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather
  than opting this whole route out of static rendering.
*/
export default function GradientGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        A gradient is easiest to get right when you can see the whole thing while you edit it — so
        this tool makes the gradient itself the backdrop, not a small preview swatch off to the
        side. Every control floats on top of it as a glass panel, reacting instantly as you switch
        between linear, radial, and conic gradients, drag the large angle dial or position pad to
        shape its direction or center, and add, move, or recolor as many stops as you like along
        the bar.
      </p>
      <p>
        Beyond the geometry, you can choose which color space the browser interpolates between
        stops in — OKLCH, HSL, or plain RGB — and, for the two polar spaces, which direction a hue
        travels around the color wheel, since that single choice can turn a muddy middle stop into
        a vivid one. A curated preset gallery offers starting points across all three gradient
        types.
      </p>
      <p>
        Once a gradient looks right, export it straight into a CSS declaration, a Tailwind
        arbitrary-value class, or a React inline style object, copy a shareable permalink that
        encodes the exact state, or step back through edits with undo/redo. Your in-progress
        gradient also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the gradient generator…</p>}>
        <GradientGenerator />
      </Suspense>
    </>
  );
}
