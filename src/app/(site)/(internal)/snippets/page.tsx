import { JSX } from "react";
import type {Metadata } from "next";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getSortedSnippets } from "@/lib/snippets";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { formatMonthYear } from "@/utils/date";
import {
  SnippetsSection,
  SnippetsList,
  Snippet,
  SnippetName,
  SnippetDescription,
  SnippetMeta,
  SnippetMetaItem
} from "@/app/(site)/(internal)/snippets/snippets.styles";

export const metadata: Metadata = {
  title: "Snippets",
  description: "Concise code fragments to solve discrete challenges.",
  alternates: { canonical: "/snippets" },
  openGraph: {
    title: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    url: "/snippets",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
  }
};

// Renders the snippets index — a list of all snippets sorted by date, each showing
// title, description, category tags, and last-modified month. Falls back to "—"
// when lastModifiedAt is absent from the snippet's metadata.
export default function SnippetsPage(): JSX.Element {
  return (
    <>
      <SnippetsSection aria-labelledby="snippets-list-title">
        <VisuallyHidden as="h2" id="snippets-list-title">
          Browse snippets
        </VisuallyHidden>

        <p>{metadata.description}</p>

        <SnippetsList>
          {getSortedSnippets().map((snippet) => {
            const lastModified = snippet.lastModifiedAt
              ? formatMonthYear(snippet.lastModifiedAt)
              : "—";

            return (
              <Snippet key={snippet.slug}>
                <Link href={`/snippet/${snippet.slug}`} title={snippet.title}>
                  <SnippetName dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(snippet.title) }} />

                  <SnippetDescription>{snippet.description}</SnippetDescription>

                  <SnippetMeta>
                    <SnippetMetaItem>
                      <strong>Category: </strong>
                      {snippet.category.join(", ")}
                    </SnippetMetaItem>
                    <SnippetMetaItem>
                      <strong>Last modified: </strong>
                      {lastModified}
                    </SnippetMetaItem>
                  </SnippetMeta>
                </Link>
              </Snippet>
            );
          })}
        </SnippetsList>
      </SnippetsSection>
    </>
  );
}
