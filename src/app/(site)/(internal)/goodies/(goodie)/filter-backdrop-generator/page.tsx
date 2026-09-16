import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import FilterGenerator from "@/components/FilterGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Filter & Backdrop Generator";
const DESCRIPTION =
  "Optics-bench filter editor — slot CSS filter functions (blur, brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia, drop-shadow) into an ordered lens rack, aim them at the preview subject itself or through a translucent backdrop-filter panel, and export straight to CSS, Tailwind, or React.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/filter-backdrop-generator/cover.png",
  width: 1536,
  height: 1024,
  alt: "A dark equipment-chassis cover image for a Filter & Backdrop Generator, featuring a numbered lens rack of CSS filter functions connected by a sprocket-perforated rail, a camera-viewfinder preview with corner brackets and an exposure readout, and CSS/Tailwind/React export."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/filter-backdrop-generator",
  image: IMAGE
});

/*
  Static server component wrapper — FilterGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function FilterBackdropGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        A CSS <code>filter</code> is really a small stack of functions applied in sequence — blur,
        brightness, contrast, grayscale, hue-rotate, invert, opacity, saturate, sepia, and
        drop-shadow — so this editor renders that stack as a numbered lens rack: slot a function in,
        dial in its one value, and watch it join the light path in order. A physical switch on the
        side throws between two targets: <code>filter</code>, which processes the preview subject
        itself, or <code>backdrop-filter</code>, which instead processes whatever sits behind a
        translucent panel floating over the subject — the exact mechanism glassmorphism depends on.
      </p>
      <p>
        The viewfinder preview frames whichever target is active like a camera composing a shot,
        complete with autofocus-style corner brackets and a small exposure readout. Switch to
        Backdrop and the stage swaps in a busy optics test chart behind the panel so the blur,
        saturation, or hue shift you dial in is something you can actually see happening, not just
        infer. A curated slide tray of presets — glassmorphism, frosted dark glass, a vintage photo
        look, a vivid pop, and more — swaps in a whole rack configuration at once.
      </p>
      <p>
        Once a look is dialed in, export it straight into a CSS declaration, a Tailwind
        arbitrary-property class, or a React inline style object, copy a shareable permalink that
        encodes the exact rack configuration, or step back through edits with undo/redo. Your
        in-progress filter also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the filter editor…</p>}>
        <FilterGenerator />
      </Suspense>
    </>
  );
}
