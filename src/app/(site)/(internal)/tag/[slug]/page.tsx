import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VisuallyHidden from "@/components/VisuallyHidden";
import PostList from "@/components/PostList";
import { getAllTags, getPostsByTag, getTagBySlug, getTagMeta } from "@/lib/tags";
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import {
  TagArchiveSection,
  TagArchiveKicker,
  TagDescription
} from "@/app/(site)/(internal)/tag/[slug]/tag.styles";

// Fully static: one page per tag, generated at build time; unknown slugs 404.
export const dynamic = "force-static";
export const dynamicParams = false;

// Pluralise "post"/"posts" for a count.
function postsLabel(count: number): string {
  return `${count} post${count === 1 ? "" : "s"}`;
}

// Emit one route per unique tag slug — the Next.js port of Jekyll's TagGenerator.
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

  // Title + description come from the data/tags.ts registry (with fallback).
  const { title, description } = getTagMeta(slug, tag);

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

// Renders every post carrying this tag, reusing the shared PostList feed.
export default async function TagPage({ params }: TagPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const tag = getTagBySlug(slug);
  if (!tag) notFound();

  const posts = getPostsByTag(slug);
  const { title, description } = getTagMeta(slug, tag);

  return (
    <TagArchiveSection aria-labelledby="page-title">
      <PageTitle id="page-title" dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(title) }} />

      <TagDescription>{description}</TagDescription>

      <TagArchiveKicker>
        {postsLabel(posts.length)}
      </TagArchiveKicker>

      <VisuallyHidden as="h2" id="tag-posts-title">
        Posts tagged {tag}
      </VisuallyHidden>

      <PostList posts={posts} />
    </TagArchiveSection>
  );
}
