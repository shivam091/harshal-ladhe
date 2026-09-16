import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import BoxShadowGenerator from "@/components/BoxShadowGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Box Shadow Generator";
const DESCRIPTION =
  "Layered box-shadow editor — stack, reorder, duplicate, and remove per-layer offset/blur/spread/color/inset shadows on a physically stacked deck, tune the surface and page colors, and export straight to CSS, Tailwind, or React.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/box-shadow-generator/cover.png",
  width: 1536,
  height: 1024,
  alt: "A cool, tabletop-toned cover image for a Box Shadow Generator, featuring a stacked deck of shadow-layer cards rising off a recessed surface, a preview swatch resting on its own ambient ground shadow, and CSS/Tailwind/React export."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/box-shadow-generator",
  image: IMAGE
});

/*
  Static server component wrapper — BoxShadowGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function BoxShadowGeneratorPage(): JSX.Element {
  return (
    <>
      <p>
        A CSS <code>box-shadow</code> is easiest to get right when you can actually see it as depth
        rather than imagine it from four numbers — so this editor renders every shadow as a
        physically stacked deck of layer cards, each one sitting a little further from the viewer
        than the last, exactly matching how CSS itself renders the first-listed shadow closest to
        you. Add, duplicate, remove, and reorder layers right there in the stack, then dial in each
        one&apos;s offset, blur, spread, opacity, color, and inset toggle.
      </p>
      <p>
        The surface and page color controls matter more than they look — a soft-UI/neumorphic
        shadow only reads correctly when the two are close to identical, and the curated preset
        gallery includes raised and pressed soft-UI looks alongside material cards, a layered
        smooth-depth shadow, a long shadow, a neon glow, and more, each rendered on its own page
        color so it always previews correctly regardless of what you were working on before.
      </p>
      <p>
        Once a shadow looks right, export it straight into a CSS declaration, a Tailwind
        arbitrary-value class, or a React inline style object, copy a shareable permalink that
        encodes the exact layers and colors, or step back through edits with undo/redo. Your
        in-progress shadow also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the shadow editor…</p>}>
        <BoxShadowGenerator />
      </Suspense>
    </>
  );
}
