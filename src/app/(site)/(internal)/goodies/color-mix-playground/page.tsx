import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import ColorMixPlayground from "@/components/ColorMixPlayground";

const TITLE = "Color-Mix Space Playground";
const DESCRIPTION =
  "color-mix() editor comparing srgb/hsl/hwb/lch/oklch/lab/oklab interpolation side by side on the same two colors, a ratio-driven result swatch, and CSS/Tailwind/React code output with shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/color-mix-playground" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/color-mix-playground",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — ColorMixPlayground itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function ColorMixPlaygroundPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the color-mix editor…</p>}>
        <ColorMixPlayground />
      </Suspense>
    </>
  );
}
