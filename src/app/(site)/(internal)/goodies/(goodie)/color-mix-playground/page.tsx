import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import ColorMixPlayground from "@/components/ColorMixPlayground";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Color-Mix Space Playground";
const DESCRIPTION =
  "color-mix() editor comparing srgb/hsl/hwb/lch/oklch/lab/oklab interpolation side by side on the same two colors, a ratio-driven result swatch, and CSS/Tailwind/React code export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/color-mix-playground"
});

/*
  Static server component wrapper — ColorMixPlayground itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function ColorMixPlaygroundPage(): JSX.Element {
  return (
    <>
      <p>
        color-mix() takes a color space as its first argument, and that choice changes the result
        more than most people expect — mixing red and blue in srgb passes straight through a dull
        purple, while oklch swings around the hue wheel through pink or green depending on
        direction. This playground mixes the same two colors in every supported space at once, so
        the difference is visible side by side instead of guessed at.
      </p>
      <p>
        Drag the ratio slider and every space&apos;s result swatch updates together, live, making
        it obvious which spaces stay perceptually smooth through the midpoint and which ones dip
        through a muddy gray. Pick two colors from a curated preset or type in your own hex values
        to compare.
      </p>
      <p>
        Export the winning color-mix() call straight to CSS, Tailwind, or React once you&apos;ve
        picked a space, or copy a shareable permalink that encodes the exact state. Your
        in-progress mix also autosaves locally, so a refresh or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the mix playground…</p>}>
        <ColorMixPlayground />
      </Suspense>
    </>
  );
}
