import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import BoxShadowGenerator from "@/components/BoxShadowGenerator";

const TITLE = "Box-Shadow Generator";
const DESCRIPTION =
  "Layered box-shadow editor with per-layer offset/blur/spread sliders, an inset toggle, reorderable/duplicable layers, live neumorphism and soft-UI presets, and CSS/Tailwind/React code output with shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/box-shadow-generator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/box-shadow-generator",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — BoxShadowGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function BoxShadowGeneratorPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the shadow editor…</p>}>
        <BoxShadowGenerator />
      </Suspense>
    </>
  );
}
