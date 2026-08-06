import { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getArchiveItems } from "@/lib/archives";
import ArchivesClient from "@/app/(site)/(internal)/archives/ArchivesClient";
import { ArchivesSection } from "@/app/(site)/(internal)/archives/archives.styles";

export const metadata: Metadata = {
  title: "Archives",
  description: "Browse the full archive of technical articles and snippets arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more.",
  alternates: { canonical: "/archives" },
  openGraph: {
    title: "Archives",
    description: "Browse the full archive of technical articles and snippets arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more.",
    url: "/archives",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Archives",
    description: "Browse the full archive of technical articles and snippets arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more.",
  }
};

// Chronological archive — posts, snippets, and series threaded onto a single, filterable timeline.
export default function ArchivesPage(): JSX.Element {
  const items = getArchiveItems();

  return (
    <>
      <ArchivesSection aria-labelledby="archives-list-title">
        <VisuallyHidden as="h2" id="archives-list-title">
          Browse posts, snippets, and series by year
        </VisuallyHidden>

        <p>{metadata.description as string}</p>

        <ArchivesClient items={items} />
      </ArchivesSection>
    </>
  );
}
