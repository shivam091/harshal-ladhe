import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import RegexTester from "@/components/RegexTester";

const TITLE = "Regex Tester";
const DESCRIPTION =
  "Live regex tester with match highlighting, per-match capture groups (numbered and named), a plain-English explain panel that breaks the pattern down piece by piece (groups, character classes, quantifiers, lookarounds), and JavaScript/Python/Java export with shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/regex-tester" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/regex-tester",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — RegexTester itself is the client component that reads `?state=`
  via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than opting
  this whole route out of static rendering.
*/
export default function RegexTesterPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the regex tester…</p>}>
        <RegexTester />
      </Suspense>
    </>
  );
}
