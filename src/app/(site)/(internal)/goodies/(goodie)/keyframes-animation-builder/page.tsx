import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import KeyframesBuilder from "@/components/KeyframesBuilder";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Shared by the page metadata and share previews — the visible <h1> comes from the goodies registry via the segment layout.
const TITLE = "Keyframes Animation Builder";
// Search/share-preview summary; mirrors the goodies registry blurb.
const DESCRIPTION =
  "Dope-sheet @keyframes builder — place and drag keyframes on a timeline, pin translate/rotate/scale/opacity/colour/radius per stop, scrub a live preview, start from bounce/pulse/shake presets, and export to CSS/Tailwind/React.";

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/keyframes-animation-builder"
});

/*
  Static server component wrapper — KeyframesBuilder itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function KeyframesAnimationBuilderPage(): JSX.Element {
  return (
    <>
      <p>
        An @keyframes block is a list of moments, but it&apos;s hard to feel the rhythm of one from
        the percentages alone — a 14% beat and a 28% beat look nearly identical on the page and
        completely different on screen. This builder lays the stops out on an exposure track, the
        way animators have timed motion on dope sheets for a century: click the track to add a
        keyframe, drag it (or nudge it with the arrow keys) to retime it, and the live preview
        follows along.
      </p>
      <p>
        Every property is opt-in per keyframe. Pin a translate, rotation, scale, opacity, background
        colour, or border radius where it matters and leave it unset everywhere else, and the
        browser interpolates straight across — exactly the behaviour explored in{" "}
        <Link href="/post/animations/css-keyframes-guide">An Interactive Guide to CSS Keyframes</Link>.
        The preview runs the real generated CSS, so scrubbing the playhead parks it on the actual
        values the browser computes at that moment, per-stop timing functions and all.
      </p>
      <p>
        Start from a bounce, pulse, shake, or heartbeat preset, then export the finished animation
        as plain CSS, a Tailwind utility with its theme registration, or a React style object with
        its keyframes string. Copy a permalink that encodes the whole sheet, step back through
        edits with undo/redo, and rely on the local autosave to keep your work through a refresh.
      </p>

      <Suspense fallback={<p>Loading the keyframes builder…</p>}>
        <KeyframesBuilder />
      </Suspense>
    </>
  );
}
