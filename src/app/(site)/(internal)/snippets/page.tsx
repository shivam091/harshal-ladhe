import type { JSX } from "react";
import type {Metadata } from "next";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getSortedSnippets } from "@/lib/snippets";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { formatMonthYear } from "@/utils/date";
import {
  SnippetsSection,
  SnippetsTableWrapper,
  SnippetsTable,
  SnippetRow
} from "@/app/(site)/(internal)/snippets/snippets.styles";

export const metadata: Metadata = {
  title: "Snippets",
  description: "Concise code fragments to solve discrete challenges.",
  alternates: { canonical: "/snippets" },
  openGraph: {
    title: "Snippets",
    description: "Concise code fragments to solve discrete challenges.",
    url: "/snippets",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Snippets",
    description: "Concise code fragments to solve discrete challenges."
  }
};

// A table keeps many small snippets scannable at a glance; newest-first surfaces recent additions.
export default function SnippetsPage(): JSX.Element {
  return (
    <>
      <SnippetsSection aria-labelledby="snippets-list-title">
        <VisuallyHidden as="h2" id="snippets-list-title">
          Browse snippets
        </VisuallyHidden>

        <p>A collection of small, focused code snippets — copy, tweak, and drop them straight into your project.</p>

        <SnippetsTableWrapper>
          <SnippetsTable>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col">Published</th>
                <th scope="col">Last modified</th>
              </tr>
            </thead>
            <tbody>
              {getSortedSnippets().map((snippet, index) => {
                const published = snippet.publishedAt
                  ? formatMonthYear(snippet.publishedAt)
                  : "—";
                const lastModified = snippet.lastModifiedAt
                  ? formatMonthYear(snippet.lastModifiedAt)
                  : "—";

                return (
                  <SnippetRow key={snippet.slug}>
                    <td>{index + 1}</td>
                    <td>
                      <Link href={`/snippet/${snippet.slug}`} title={snippet.title}>
                        <span dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(snippet.title) }} />
                      </Link>
                    </td>
                    <td>{snippet.category.join(", ")}</td>
                    <td>{published}</td>
                    <td>{lastModified}</td>
                  </SnippetRow>
                );
              })}
            </tbody>
          </SnippetsTable>
        </SnippetsTableWrapper>
      </SnippetsSection>
    </>
  );
}
