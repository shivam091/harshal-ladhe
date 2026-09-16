import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import RegexTester from "@/components/RegexTester";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Regex Tester";
const DESCRIPTION =
  "Live regex tester — match a pattern against real text as you type, see numbered and named capture groups highlighted directly in the string, and read a plain-English breakdown of what the pattern actually does.";
const IMAGE: GoodieMetadataImage = {
  path: "/assets/img/goodies/regex-tester/cover.png",
  width: 1536,
  height: 1024,
  alt: "A warm, paper-toned cover image for a Regex Tester, featuring a marked-up test string with highlighter-style matches, sticky-note capture group tags, a plain-English explain panel, and JavaScript/Python/Java export."
};

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/regex-tester",
  image: IMAGE
});

/*
  Static server component wrapper — RegexTester itself is the client component that reads `?state=`
  via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than opting
  this whole route out of static rendering.
*/
export default function RegexTesterPage(): JSX.Element {
  return (
    <>
      <p>
        A regular expression is easy to write and hard to trust — the only way to really know what
        one does is to run it against real text and see what lights up. This tester does exactly
        that: type a pattern and its flags, paste in a test string, and every match is marked up
        live directly in the text, with numbered and named capture groups called out right where
        they were captured, rather than left as an abstract list you have to cross-reference by eye.
      </p>
      <p>
        Every match also gets its own breakdown of captures, and the pattern itself is read back
        piece by piece in plain English — a group, a quantifier, a character class — so a dense
        pattern like <code>(?&lt;year&gt;\d{"{4}"})-(?&lt;month&gt;\d{"{2}"})</code> stops being a
        wall of punctuation and starts reading like a sentence. An invalid pattern surfaces its
        exact error inline, right where it was typed.
      </p>
      <p>
        Once a pattern is right, export it straight into JavaScript, Python, or Java source, copy a
        shareable permalink that encodes the exact pattern, flags, and test string, or step back
        through edits with undo/redo. Your in-progress pattern also autosaves locally, so a refresh
        or a closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the regex tester…</p>}>
        <RegexTester />
      </Suspense>
    </>
  );
}
