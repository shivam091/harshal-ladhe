import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import SvgToReactConverter from "@/components/SvgToReactConverter";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "SVG → React Component Converter";
const DESCRIPTION =
  "Paste, drop or upload an SVG and get a clean React component — camelCased JSX props, editor cruft stripped, colours swapped for currentColor, and title/size/ref props wired in, with a sanitised side-by-side preview.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/svg-to-react"
});

/*
  Static server component wrapper — SvgToReactConverter itself is the client component that reads
  `?state=` via useSearchParams (and parses SVG with the browser's DOMParser), which Next.js
  requires to sit inside a Suspense boundary rather than opting this whole route out of static
  rendering.
*/
export default function SvgToReactPage(): JSX.Element {
  return (
    <>
      <p>
        An SVG straight out of a design tool is rarely ready to drop into JSX. Attributes are
        hyphenated where React wants camelCase, <code>class</code> needs to be{" "}
        <code>className</code>, inline styles are strings, and the file is padded with editor
        metadata, namespaced attributes and hard-coded colours that stop the icon following the
        surrounding text colour.
      </p>
      <p>
        This converter parses the SVG in your browser and rebuilds it as a component, one
        switchable transform at a time — strip the cruft, inline <code>&lt;style&gt;</code>{" "}
        classes, drop the fixed dimensions, swap colours for <code>currentColor</code>, and wire
        in <code>title</code>, <code>size</code> and <code>ref</code> props. A log lists exactly
        what changed, and the preview renders the original and the converted artwork side by
        side, so you can tint it and watch <code>currentColor</code> at work.
      </p>
      <p>
        Pasted markup is treated as untrusted: scripts, event handlers, <code>javascript:</code>{" "}
        links and <code>&lt;foreignObject&gt;</code> are removed before anything is rendered or
        exported. Copy or download the finished <code>.tsx</code> or <code>.jsx</code>, or copy a
        shareable permalink — your input also autosaves locally, so a refresh won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the converter…</p>}>
        <SvgToReactConverter />
      </Suspense>
    </>
  );
}
