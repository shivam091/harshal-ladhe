import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import PopoverAnchorBuilder from "@/components/PopoverAnchorBuilder";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

const TITLE = "Popover / Anchor-Positioning Builder";
const DESCRIPTION =
  "Live trigger-and-popover builder combining the real HTML popover attribute with real CSS anchor positioning — a compass-style anchor-side picker, offset, auto/manual dismiss, backdrop, and entrance-animation/fallback toggles, with an automatic static-position fallback for unsupported browsers, plus CSS/HTML/React code export.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/popover-anchor-positioning-builder"
});

/*
  Static server component wrapper — PopoverAnchorBuilder itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function PopoverAnchorPositioningBuilderPage(): JSX.Element {
  return (
    <>
      <p>
        CSS anchor positioning finally lets a floating element track a trigger without a single
        line of positioning JavaScript, but the syntax is new and easy to get subtly wrong — an
        anchor-side picked in the wrong axis, an offset that reads backwards, a fallback that
        never triggers. This builder is a direct-manipulation way to explore it: drag the anchor
        side on the compass, drag the offset, and the popover on the right re-anchors live.
      </p>
      <p>
        Behavior controls cover the parts anchor positioning doesn&apos;t decide for you — whether
        the popover dismisses on an outside click or only a manual toggle, whether a backdrop dims
        the page behind it, and whether it animates in with the CSS discrete-property transition
        trick. A static-position fallback is generated automatically for browsers without anchor
        positioning support, so the exported code degrades gracefully rather than breaking.
      </p>
      <p>
        Once it&apos;s right, export straight to CSS, plain HTML, or a React component, copy a
        shareable permalink that encodes the exact state, or step back through edits with
        undo/redo. Your in-progress setup also autosaves locally, so a refresh or a closed tab
        won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the popover builder…</p>}>
        <PopoverAnchorBuilder />
      </Suspense>
    </>
  );
}
