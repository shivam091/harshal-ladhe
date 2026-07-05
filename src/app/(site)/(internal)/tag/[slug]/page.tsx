import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VisuallyHidden from "@/components/VisuallyHidden";
import TaxonomyFeed from "@/components/TaxonomyFeed";
import { getAllTags, getEntriesByTag, getTagBySlug, getTagMeta } from "@/lib/tags";
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";
import { inlineMarkdownToHtml, stripInlineMarkdown } from "@/utils/markdown";
import { truncate } from "@/utils/string";
import {
  TagArchiveSection,
  TagDescription
} from "@/app/(site)/(internal)/tag/[slug]/tag.styles";

// Fully static: one page per tag, generated at build time; unknown slugs 404.
export const dynamic = "force-static";
export const dynamicParams = false;

// One route per unique tag so every tag gets a static archive page.
export function generateStaticParams(): { slug: string }[] {
  return getAllTags().map(({ slug }) => ({ slug }));
}

// Props for the /tag/[slug] page and its generateMetadata — params are async per Next.js's dynamic APIs.
interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) return {};

  // Registry copy wins, with a fallback so unlisted tags still get sensible metadata.
  const meta = getTagMeta(slug, tag);
  const title = stripInlineMarkdown(meta.title);
  const description = truncate(stripInlineMarkdown(meta.description), 160);

  const url = `/tag/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website"
    },
    twitter: {
      card: "summary",
      title,
      description
    }
  };
}

// Reuses the shared post feed so tag archives look like the main post list.
export default async function TagPage({ params }: TagPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  const entries = getEntriesByTag(slug);
  const { title, description } = getTagMeta(slug, tag);

  return (
    <TagArchiveSection aria-labelledby="page-title">
      <PageTitle id="page-title" dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(title) }} />

      <TagDescription>{description}</TagDescription>

      <VisuallyHidden as="h2" id="tag-posts-title">
        Content tagged {tag}
      </VisuallyHidden>

      <TaxonomyFeed entries={entries} />
    </TagArchiveSection>
  );
}
