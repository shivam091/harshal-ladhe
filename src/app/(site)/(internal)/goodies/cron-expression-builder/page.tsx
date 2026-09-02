import { Suspense } from "react";
import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import CronBuilder from "@/components/CronBuilder";

const TITLE = "Cron Expression Builder";
const DESCRIPTION =
  "Bidirectional cron builder — per-field mode widgets (every/every-N/specific/range/range+step, plus a custom fallback) generate the 5-field cron string, a plain-English description reads it back including the day-of-month/day-of-week OR quirk, and a live next-5-runs preview with crontab/GitHub Actions/Kubernetes export and shareable permalinks.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/goodies/cron-expression-builder" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/goodies/cron-expression-builder",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION
  }
};

/*
  Static server component wrapper — CronBuilder itself is the client component that reads `?state=`
  via useSearchParams, which Next.js requires to sit inside a Suspense boundary rather than opting
  this whole route out of static rendering.
*/
export default function CronExpressionBuilderPage(): JSX.Element {
  return (
    <>
      <VisuallyHidden as="h2">{TITLE}</VisuallyHidden>
      <p>{DESCRIPTION}</p>

      <Suspense fallback={<p>Loading the cron builder…</p>}>
        <CronBuilder />
      </Suspense>
    </>
  );
}
