import type { JSX } from "react";
import type { Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getArchiveItems } from "@/lib/archives";
import ArchivesClient from "@/app/(site)/(internal)/archives/ArchivesClient";
import { ArchivesSection } from "@/app/(site)/(internal)/archives/archives.styles";

export const metadata: Metadata = {
  title: "Archives",
  description: "Browse the full archive of technical articles, snippets, and tutorials arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more.",
  alternates: { canonical: "/archives" },
  openGraph: {
    title: "Archives",
    description: "Browse the full archive of technical articles, snippets, and tutorials arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more.",
    url: "/archives",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Archives",
    description: "Browse the full archive of technical articles, snippets, and tutorials arranged by date. Track your learning journey across JavaScript, CSS, HTML, Python, and more."
  }
};

// One timeline across every content type so readers can browse everything by date.
export default function ArchivesPage(): JSX.Element {
  const items = getArchiveItems();

  return (
    <>
      <ArchivesSection aria-labelledby="archives-list-title">
        <VisuallyHidden as="h2" id="archives-list-title">
          Browse posts, snippets, and tutorials by year
        </VisuallyHidden>

        <p>{metadata.description as string}</p>

        <ArchivesClient items={items} />
      </ArchivesSection>
    </>
  );
}
