import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import JsonToTsGenerator from "@/components/JsonToTsGenerator";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "JSON ⇄ TS Interface Generator";
const DESCRIPTION =
  "Bidirectional JSON/TypeScript converter — generate nested, de-duplicated interfaces with optional-field inference from JSON, or a sample JSON payload from hand-typed TS interfaces.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/json-to-ts"
});

/*
  Static server component wrapper — JsonToTsGenerator itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function JsonToTsPage(): JSX.Element {
  return (
    <>
      <p>
        Turning an API response into TypeScript interfaces by hand means re-reading the same
        nested JSON over and over, naming each shape, and guessing which fields are actually
        optional. This converter does it in one pass: paste JSON in and it walks the structure,
        de-duplicates any shape that repeats, and infers <code>?</code> on fields that aren&apos;t
        present on every sibling object.
      </p>
      <p>
        It runs the other direction too — type out interfaces by hand and it generates a sample
        JSON payload that satisfies them, useful for mocking a response before the real API
        exists.
      </p>
      <p>
        Copy the generated output straight from the result pane, or copy a shareable permalink
        that encodes the exact state. Your in-progress source also autosaves locally, so a refresh
        or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the converter…</p>}>
        <JsonToTsGenerator />
      </Suspense>
    </>
  );
}
