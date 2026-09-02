import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import JsonToTsGenerator from "@/components/JsonToTsGenerator";

const TITLE = "JSON ⇄ TS Interface Generator";
const DESCRIPTION =
  "Bidirectional JSON/TypeScript converter — paste JSON to generate nested interfaces with de-duplicated shapes and optional-field inference across arrays, or paste TS interfaces to generate a sample JSON payload, with shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/json-to-ts" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/json-to-ts",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — JsonToTsGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function JsonToTsPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the converter…</p>}>
        <JsonToTsGenerator />
      </Suspense>
    </>
  );
}
