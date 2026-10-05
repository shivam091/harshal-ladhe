import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import OpenGraphPreview from "@/components/OpenGraphPreview";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Matches the goodies registry entry's name, so the <h1> from the shared layout and the page metadata agree.
const TITLE = "Meta / Open Graph Preview";
// Doubles as this page's own meta description, so it's written to fit the ~160-character limit the tool itself audits for.
const DESCRIPTION =
  "Edit or paste meta tags and preview X, LinkedIn, Slack, Facebook, Discord, iMessage and Google cards, with a tag audit and HTML/Next.js/React export.";

// No cover image yet, so buildGoodieMetadata falls back to a summary card for this page.
export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/open-graph-preview"
});

/*
  Static server component wrapper — OpenGraphPreview itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function OpenGraphPreviewPage(): JSX.Element {
  return (
    <>
      <p>
        Every platform turns the same handful of meta tags into a slightly different card — X crops
        to one aspect ratio, LinkedIn clamps the title to two lines, Google cuts the title off at
        roughly 60 characters and the snippet at about 160 — and the only usual way to see the
        result is to publish and paste the link somewhere. This tool pins recreated previews for X,
        LinkedIn, Slack, Facebook, Discord, iMessage, and a Google search result side by side, each
        with its own light/dark switch, and redraws them as you type.
      </p>
      <p>
        Fill in the form, try out an image straight from your computer, or paste an existing page&apos;s{" "}
        <code>&lt;head&gt;</code> to pull its tags in. Everything happens in your browser: the pasted
        markup is parsed locally and nothing is fetched from your site, since this is a static page with
        no server to crawl URLs on your behalf. The cards are brand-neutral approximations of each
        platform&apos;s layout rather than pixel-perfect copies, so treat them as a close guide, not a
        guarantee. An audit panel checks lengths, image size and aspect ratio (measured from the image
        itself), alt text, absolute URLs, and the card and type tags.
      </p>
      <p>
        Export the result as raw HTML <code>&lt;meta&gt;</code> tags, a Next.js App Router{" "}
        <code>metadata</code> object, or a <code>next/head</code> JSX snippet, or copy a shareable
        permalink that encodes the exact fields. Your in-progress tags also autosave locally — an uploaded
        image is the one exception, staying in this tab only.
      </p>

      <Suspense fallback={<p>Loading the preview board…</p>}>
        <OpenGraphPreview />
      </Suspense>
    </>
  );
}
