import type { JSX } from "react";
import type {Metadata } from "next";
import { notFound } from "next/navigation";
import VisuallyHidden from "@/components/VisuallyHidden";
import PostList from "@/components/PostList";
import {
  getAllCategories,
  getPostsByCategory,
  getCategoryBySlug,
  getCategoryMeta
} from "@/lib/categories";
// Props for the /category/[slug] page and its generateMetadata — params are async per Next.js's dynamic APIs.
interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}
import { PageTitle } from "@/components/PageHeading/PageHeading.styles";
import {
  CategoryArchiveSection,
  CategoryArchiveKicker,
  CategoryDescription
} from "@/app/(site)/(internal)/category/[slug]/category.styles";

// Fully static: one page per category, generated at build time; unknown slugs 404.
export const dynamic = "force-static";
export const dynamicParams = false;

// Pluralise "post"/"posts" for a count.
function postsLabel(count: number): string {
  return `${count} post${count === 1 ? "" : "s"}`;
}

// Emit one route per unique category slug — the Next.js port of Jekyll's CategoryGenerator.
export function generateStaticParams(): { slug: string }[] {
  return getAllCategories().map(({ slug }) => ({ slug }));
}

// Builds SEO/OG/Twitter metadata for a category archive; empty for an unknown slug (404s in the page itself).
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  // Title + description come from the data/categories.ts registry (with fallback).
  const { title, description } = getCategoryMeta(slug, category);

  const url = `/category/${slug}`;

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

// Renders every post filed under this category, reusing the shared PostList feed.
export default async function CategoryPage({ params }: CategoryPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = getPostsByCategory(slug);
  const { title, description } = getCategoryMeta(slug, category);

  return (
    <>
      <CategoryArchiveSection aria-labelledby="page-title">
        <PageTitle id="page-title">{title}</PageTitle>

        <CategoryDescription>{description}</CategoryDescription>

        <CategoryArchiveKicker>
          {postsLabel(posts.length)}
        </CategoryArchiveKicker>

        <VisuallyHidden as="h2" id="category-posts-title">
          Posts in {category}
        </VisuallyHidden>

        <PostList posts={posts} />
      </CategoryArchiveSection>
    </>
  );
}
