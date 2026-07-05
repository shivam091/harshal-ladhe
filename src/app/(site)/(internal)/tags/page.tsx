import type { JSX } from "react";
import type {Metadata } from "next";
import Link from "next/link";
import VisuallyHidden from "@/components/VisuallyHidden";
import { getAllTags } from "@/lib/tags";
import {
  TagsSection,
  TagsList,
  TagItem
} from "@/app/(site)/(internal)/tags/tags.styles";

export const metadata: Metadata = {
  title: "Tags",
  description: "Discover posts, tutorials, and snippets by tag for quick topic navigation. From front-end tricks to backend techniques, filter learning resources easily.",
  alternates: { canonical: "/tags" },
  openGraph: {
    title: "Tags",
    description: "Discover posts, tutorials, and snippets by tag for quick topic navigation. From front-end tricks to backend techniques, filter learning resources easily.",
    url: "/tags",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Tags",
    description: "Discover posts, tutorials, and snippets by tag for quick topic navigation. From front-end tricks to backend techniques, filter learning resources easily."
  }
};

// Entry counts show at a glance which topics have the most writing.
export default function TagsPage(): JSX.Element {
  const tags = getAllTags();

  return (
    <>
      <TagsSection aria-labelledby="tags-list-title">
        <VisuallyHidden as="h2" id="tags-list-title">
          Browse posts, tutorials, and snippets by tags
        </VisuallyHidden>

        <p>{metadata.description as string}</p>

        <TagsList>
          {tags.map(({ tag, slug, count }) => (
            <TagItem key={slug}>
              <Link
                href={`/tag/${slug}`}
                className="tag-link"
                rel="tag"
                aria-label={`Tag: ${tag} (${count} entr${count === 1 ? "y" : "ies"})`}
              >
                #{tag}
              </Link>
              <span className="tag-count">{count}</span>
            </TagItem>
          ))}
        </TagsList>
      </TagsSection>
    </>
  );
}
