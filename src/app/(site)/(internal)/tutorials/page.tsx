import type { JSX } from "react";
import type {Metadata } from "next";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getSortedTutorials } from "@/lib/tutorials";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { formatMonthYear } from "@/utils/date";
import {
  TutorialsSection,
  TutorialsList,
  Tutorial,
  TutorialName,
  TutorialDescription,
  TutorialMeta,
  TutorialMetaItem
} from "@/app/(site)/(internal)/tutorials/tutorials.styles";

export const metadata: Metadata = {
  title: "Tutorials",
  description: "In-depth, step-by-step guides for building things from scratch.",
  alternates: { canonical: "/tutorials" },
  openGraph: {
    title: "Tutorials",
    description: "In-depth, step-by-step guides for building things from scratch.",
    url: "/tutorials",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Tutorials",
    description: "In-depth, step-by-step guides for building things from scratch."
  }
};

// Renders the tutorials index — a list of all tutorials sorted by date, each showing
// title, description, category tags, and last-modified month. Falls back to "—"
// when lastModifiedAt is absent from the tutorial's metadata.
export default function TutorialsPage(): JSX.Element {
  return (
    <>
      <TutorialsSection aria-labelledby="tutorials-list-title">
        <VisuallyHidden as="h2" id="tutorials-list-title">
          Browse tutorials
        </VisuallyHidden>

        <p>Follow-along guides that build something real from the ground up, one step at a time.</p>

        <TutorialsList>
          {getSortedTutorials().map((tutorial) => {
            const lastModified = tutorial.lastModifiedAt
              ? formatMonthYear(tutorial.lastModifiedAt)
              : "—";

            return (
              <Tutorial key={tutorial.slug}>
                <TutorialName>
                  <Link href={`/tutorial/${tutorial.slug}`} title={tutorial.title}>
                    <span dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(tutorial.title) }} />
                  </Link>
                </TutorialName>

                <TutorialDescription>{tutorial.description}</TutorialDescription>

                <TutorialMeta>
                  <TutorialMetaItem>
                    <strong>Category: </strong>
                    {tutorial.category.join(", ")}
                  </TutorialMetaItem>
                  <TutorialMetaItem>
                    <strong>Last modified: </strong>
                    {lastModified}
                  </TutorialMetaItem>
                </TutorialMeta>
              </Tutorial>
            );
          })}
        </TutorialsList>
      </TutorialsSection>
    </>
  );
}
