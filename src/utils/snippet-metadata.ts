import type { Metadata } from "next";
import { getSnippetBySlug } from "@/data/snippets";
import { getSnippetDates } from "@/lib/snippets";
import { buildContentMetadata } from "@/utils/build-content-metadata";

// Builds Next.js metadata for a snippet page from its registry entry (see buildContentMetadata).
export function buildSnippetMetadata(slug: string): Metadata {
  const snippet = getSnippetBySlug(slug);
  if (!snippet) return {};

  const { publishedAt, lastModifiedAt } = getSnippetDates(slug);

  return buildContentMetadata({
    title: snippet.title,
    description: snippet.description,
    url: `/snippet/${snippet.slug}`,
    tags: snippet.tags,
    image: snippet.image,
    publishedAt,
    lastModifiedAt,
  });
}
