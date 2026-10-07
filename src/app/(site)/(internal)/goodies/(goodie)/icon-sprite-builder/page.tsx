import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import IconSpriteBuilder from "@/components/IconSpriteBuilder";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Icon Sprite Builder";
const DESCRIPTION =
  "Combine SVG icons into one sprite of <symbol> elements with matching <use> snippets for HTML, React and an external file — ids auto-slugged and de-duplicated, internal ids prefixed, colours optionally swapped for currentColor, and every paste sanitised.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/icon-sprite-builder"
});

/*
  Static server component wrapper — IconSpriteBuilder itself is the client component that reads
  `?state=` via useSearchParams (and parses SVG with the browser's DOMParser), which Next.js
  requires to sit inside a Suspense boundary rather than opting this whole route out of static
  rendering.
*/
export default function IconSpriteBuilderPage(): JSX.Element {
  return (
    <>
      <p>
        An SVG sprite gathers a whole icon set into one file of <code>&lt;symbol&gt;</code>{" "}
        elements, each with its own id and <code>viewBox</code>. Anywhere on the page, a two-line{" "}
        <code>&lt;svg&gt;&lt;use href=&quot;#id&quot;&gt;&lt;/svg&gt;</code> then draws one of them
        — one download instead of dozens, and icons that pick up the surrounding text colour through{" "}
        <code>currentColor</code>.
      </p>
      <p>
        Paste markup, drop several <code>.svg</code> files at once, or pick from a small starter
        packet, and each icon is mounted in the album. Ids are slugged and kept unique, the outer{" "}
        <code>width</code>, <code>height</code> and <code>xmlns</code> are stripped, and internal
        ids for gradients, clip paths and masks are prefixed per symbol so two icons that both
        define <code>grad</code> can&apos;t borrow each other&apos;s fill. Reorder or remove icons,
        rename them, and watch every stamp redraw from the live sprite as you change its size and
        ink colour.
      </p>
      <p>
        Pasted markup is treated as untrusted: scripts, event handlers, <code>javascript:</code>{" "}
        links and external references are removed before anything is rendered or exported. The
        first-day cover holds the finished sprite to copy or download, plus each icon&apos;s{" "}
        <code>&lt;use&gt;</code> snippet for HTML, React and an external file, and a byte count
        comparing the separate files with the sprite. Your album autosaves locally, and a
        permalink carries it to anyone else.
      </p>

      <Suspense fallback={<p>Opening the album…</p>}>
        <IconSpriteBuilder />
      </Suspense>
    </>
  );
}
