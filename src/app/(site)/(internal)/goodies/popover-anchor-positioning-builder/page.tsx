import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import PopoverAnchorBuilder from "@/components/PopoverAnchorBuilder";

const TITLE = "Popover / Anchor-Positioning Builder";
const DESCRIPTION =
  "Live trigger-and-popover builder combining the real HTML popover attribute with real CSS anchor positioning — a compass-style anchor-side picker, offset, auto/manual dismiss, backdrop, @starting-style entrance animation, and position-try-fallbacks toggles, with an automatic static-position fallback for browsers without anchor-positioning support, plus CSS/HTML/React code export.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/popover-anchor-positioning-builder" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/popover-anchor-positioning-builder",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — PopoverAnchorBuilder itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function PopoverAnchorPositioningBuilderPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the popover builder…</p>}>
        <PopoverAnchorBuilder />
      </Suspense>
    </>
  );
}
