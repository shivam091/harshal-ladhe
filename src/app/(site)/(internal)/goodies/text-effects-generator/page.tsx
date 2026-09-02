import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import TextEffectsGenerator from "@/components/TextEffectsGenerator";

const TITLE = "Text Effects Generator";
const DESCRIPTION =
  "Layered text-shadow editor (add/duplicate/remove layers, each with its own offset/blur/color) with an optional gradient text fill via background-clip: text, neon/3D/glitch/emboss/chrome presets, and CSS/Tailwind/React code output with shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/text-effects-generator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/text-effects-generator",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — TextEffectsGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function TextEffectsGeneratorPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the text editor…</p>}>
        <TextEffectsGenerator />
      </Suspense>
    </>
  );
}
