import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import CronBuilder from "@/components/CronBuilder";
import { buildGoodieMetadata } from "@/utils/goodie-metadata";
import type { GoodieMetadataImage } from "@/utils/goodie-metadata";

const TITLE = "Cron Expression Builder";
const DESCRIPTION =
  "Bidirectional cron builder — build a 5-field cron string with per-field widgets, read it back in plain English, and preview its next 5 runs with crontab, GitHub Actions, and Kubernetes export.";
// Set once a cover image exists at this path, e.g. /assets/img/goodies/cron-expression-builder/cover.png
const IMAGE: GoodieMetadataImage | undefined = undefined;

export const metadata: Metadata = buildGoodieMetadata({
  title: TITLE,
  description: DESCRIPTION,
  url: "/goodies/cron-expression-builder",
  image: IMAGE
});

/*
  Static server component wrapper — CronBuilder itself is the client component that reads `?state=`
  via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than opting
  this whole route out of static rendering.
*/
export default function CronExpressionBuilderPage(): JSX.Element {
  return (
    <>
      <p>
        Cron expressions are compact, but that compactness cuts both ways — the same five fields
        that make a schedule easy to paste into a crontab also make it easy to misread. This
        builder works in both directions: adjust a field with its dedicated widget (every,
        every-N, specific values, a range, or a range with a step) and the cron string updates
        live, or paste in an existing expression and the widgets snap to match it.
      </p>
      <p>
        Every edit is paired with a plain-English readout, including the notorious
        day-of-month/day-of-week quirk — cron treats those two fields as an OR when both are
        restricted, not an AND — so the sentence always reflects what the schedule will actually
        do, not just what it looks like. A live preview of the next five run times sits alongside
        it, computed as you edit rather than only on submit.
      </p>
      <p>
        Once a schedule is right, export it straight into the format you need — a plain crontab
        line, a GitHub Actions <code>schedule</code> block, or a Kubernetes <code>CronJob</code>{" "}
        manifest — copy a shareable permalink that encodes the exact state, or step back through
        edits with undo/redo. Your in-progress schedule also autosaves locally, so a refresh or a
        closed tab won&apos;t lose it.
      </p>

      <Suspense fallback={<p>Loading the cron builder…</p>}>
        <CronBuilder />
      </Suspense>
    </>
  );
}
