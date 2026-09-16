import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import ColorPaletteGenerator from "@/components/ColorPaletteGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Color Palette Generator";
const DESCRIPTION =
  "Print-shop swatch-fan palette builder — seed one color to generate a full 50-950 OKLCH lightness ramp, check WCAG contrast against a foreground/background pair with a stamped pass/fail seal, start from curated presets, and export straight to CSS, Tailwind, or React.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/color-palette-generator/cover.png",
  width: 1536,
  height: 1024,
  alt: "A crisp print-shop cover image for a Color Palette Generator, featuring a fanned hand of paint-swatch chips running from light to dark, a circular quality-control stamp reading AAA, and a reference binder with a die-cut hole-punch detail and corner registration marks."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/color-palette-generator",
  image: IMAGE
});

/*
  Static server component wrapper — ColorPaletteGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function ColorPaletteGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        Most color scales start from a single brand or accent color and need to become a full,
        usable range — a named 50-through-950 ramp like the ones Tailwind and Radix Colors ship.
        This editor does exactly that: type or pick one seed color and it generates the whole
        eleven-step ramp by varying lightness and chroma in OKLCH space at a fixed hue, so the
        result stays perceptually even and never drifts toward a muddy gray the way naively mixing
        the seed&apos;s own RGB channels toward white or black would — that naive approach is kept
        alongside it as a second selectable recipe specifically so the two can be compared
        side by side on the same seed.
      </p>
      <p>
        A separate foreground/background pair — independent of the seed, since a real contrast
        check is usually between existing text and background colors — gets checked live against
        the WCAG 2.x thresholds, stamped like a print shop&apos;s own quality-control seal: AAA, AA,
        or a flat fail, inked in a color that reflects the actual result. Any generated ramp step
        can be pulled out of its fanned stack for a closer look at its exact hex/OKLCH value and
        contrast against that pair, or sent straight over to stand in as the background itself. A
        curated swatch library jumps to a handful of full seed/contrast-pair combinations, including
        a deliberate near-miss that just fails AA.
      </p>
      <p>
        Once a palette is dialed in, export the generated ramp straight into a CSS custom-property
        block, a Tailwind color-scale config, or a plain React style object, copy a shareable
        permalink that encodes the exact palette, or step back through edits with undo/redo. Your
        in-progress palette also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the color palette generator…</p>}>
        <ColorPaletteGenerator />
      </Suspense>
    </>
  );
}
