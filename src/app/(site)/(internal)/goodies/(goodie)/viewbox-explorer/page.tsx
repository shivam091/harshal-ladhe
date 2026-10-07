import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ViewboxExplorer from "@/components/ViewboxExplorer";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";

// Matches the goodies registry entry, so the page title and the <h1> the layout renders agree.
const TITLE = "viewBox / preserveAspectRatio Explorer";
// Doubles as the meta and Open Graph description, so it leads with what the tool does rather than the darkroom theme.
const DESCRIPTION =
  "Drag an SVG viewBox over its user-space canvas and watch the viewport print update live, flip through every preserveAspectRatio alignment with meet or slice, and read off the exact scale, translate and transform matrix.";

// Goodies are standalone tools rather than dated articles, hence the goodie-specific metadata builder.
export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/viewbox-explorer"
});

/*
  Static server component wrapper — ViewboxExplorer itself is the client component that reads
  `?state=` via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than
  opting this whole route out of static rendering.
*/
export default function ViewboxExplorerPage(): JSX.Element {
  return (
    <>
      <p>
        In{" "}
        <Link href="/post/svg/svg-essentials-mastering-basic-shapes">SVG Essentials: Mastering Shapes, Coordinates, and Styling</Link>, the{" "}
        <code>viewBox</code> is the canvas and the <code>width</code> and <code>height</code> are the window it&apos;s shown
        through. That&apos;s easy to say and surprisingly hard to picture — especially once the two shapes stop matching and{" "}
        <code>preserveAspectRatio</code> has to decide what happens to the spare space.
      </p>
      <p>
        So picture a darkroom. Your drawing is a negative on the light box, in raw user units. The <code>viewBox</code> is the
        enlarger&apos;s masking easel: drag it, or grab a blade or corner to resize it (arrow keys work too, with Shift for bigger
        steps). The viewport is the print on the baseboard, rendered live by the browser. Pick any of the nine alignments, then
        choose whether to fit with borders (<code>meet</code>) or crop to fill (<code>slice</code>) — or let the auto-tour walk
        through all nineteen combinations for you.
      </p>
      <p>
        Overlays show the user-space grid, where the <code>viewBox</code> lands on the paper, and the letterbox borders or the
        cropped overhang. The readout gives the scale, translate and transform matrix the browser computes, with a plain-English
        account of why. Start from a preset, paste your own SVG, export the <code>&lt;svg&gt;</code> markup or a React
        component, and share a permalink; undo/redo and local autosave are built in.
      </p>

      <Suspense fallback={<p>Loading the viewBox explorer…</p>}>
        <ViewboxExplorer />
      </Suspense>
    </>
  );
}
