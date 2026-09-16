import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import TextEffectsGenerator from "@/components/TextEffectsGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Text Effects Generator";
const DESCRIPTION =
  "Live text-effects editor — a big, oversized preview on its own spotlit stage, a solid or gradient fill, a stack of text-shadow layers for glow/emboss/outline/3D-extrude looks, curated presets, and CSS/Tailwind/React export.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/text-effects-generator/cover.png",
  width: 1536,
  height: 1024,
  alt: "An editorial, magazine-production-sheet cover image for a Text Effects Generator, featuring oversized type glowing on a dark spotlit stage, a numbered manuscript-style list of text-shadow layers, and CSS/Tailwind/React export."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/text-effects-generator",
  image: IMAGE
});

/*
  Static server component wrapper — TextEffectsGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function TextEffectsGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        A text effect is easiest to judge at the size it will actually be seen, not shrunk into a
        tiny form-field preview — so this editor renders your text large on its own dark, spotlit
        stage, independent of the site&apos;s own light or dark theme, the way a real photo shoot
        keeps its own lighting regardless of the room around it. Type anything, then dial in the
        font size and weight and either a solid text color or a linear/radial/conic gradient fill
        clipped to the glyphs themselves.
      </p>
      <p>
        The real range comes from stacking text-shadow layers, listed as numbered rows on a
        manuscript-style spec sheet rather than a card stack — add, duplicate, and remove as many
        as you like, each with its own offset, blur, opacity, and color. A handful of thin,
        same-color offset layers reads as a stroke or outline around the letterforms; many
        increasing offsets read as a 3D extrusion; a few soft, wide, saturated layers read as a
        neon glow. The curated preset gallery includes neon, 3D, fire, glitch, emboss, chrome, and
        outline looks to start from, each swapping in a whole shadow/gradient/color set while
        leaving whatever you&apos;ve already typed untouched.
      </p>
      <p>
        Once a look is right, export it straight into a CSS declaration, a Tailwind
        arbitrary-value class set, or a React inline style object, copy a shareable permalink that
        encodes the exact effect, or step back through edits with undo/redo. Your in-progress
        effect also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the text effects editor…</p>}>
        <TextEffectsGenerator />
      </Suspense>
    </>
  );
}
