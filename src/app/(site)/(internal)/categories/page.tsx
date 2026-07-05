import type { JSX } from "react";
import type {Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import CategoryAccordion from "@/app/(site)/(internal)/categories/CategoryAccordion";
import { getAllCategories, getPostsByCategory } from "@/lib/categories";
import type { CategoryAccordionItem } from "@/app/(site)/(internal)/categories/CategoryAccordion/CategoryAccordion";
import { CategoriesSection } from "@/app/(site)/(internal)/categories/categories.styles";

export const metadata: Metadata = {
  title: "Categories",
  description: "Explore all content categories including JavaScript, CSS, SVG, and animations. Find focused learning paths by topic.",
  alternates: { canonical: "/categories" },
  openGraph: {
    title: "Categories",
    description: "Explore all content categories including JavaScript, CSS, SVG, and animations. Find focused learning paths by topic.",
    url: "/categories",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Categories",
    description: "Explore all content categories including JavaScript, CSS, SVG, and animations. Find focused learning paths by topic."
  }
};

// An accordion keeps every category visible at once while letting readers dig into any of them.
export default function CategoriesPage(): JSX.Element {
  const items: CategoryAccordionItem[] = getAllCategories().map(({ category, slug, count }) => ({
    category,
    slug,
    count,
    posts: getPostsByCategory(slug).map((post) => ({
      slug: post.slug,
      title: post.title,
      publishedAt: post.publishedAt
    }))
  }));

  return (
    <>
      <CategoriesSection aria-labelledby="categories-list-title">
        <VisuallyHidden as="h2" id="categories-list-title">
          Browse posts by category
        </VisuallyHidden>

        <p>{metadata.description as string}</p>

        <CategoryAccordion items={items} />
      </CategoriesSection>
    </>
  );
}
