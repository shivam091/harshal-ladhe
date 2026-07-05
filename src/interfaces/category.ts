// SEO/display metadata for a single category archive page, keyed by category slug in data/categories.ts.
export interface CategoryMeta {
  // Descriptive <h1> and <title> for the /category/<slug> archive.
  title: string;
  // Meta description shown in <head> and as the archive's intro paragraph.
  description: string;
}

// Props for the /category/[slug] page and its generateMetadata — params are async per Next.js's dynamic APIs.
export interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

/*
  One aggregated category: its display name, URL slug, post count, and the newest
  last-modified date across its posts (used for the sitemap `lastmod`).
*/
export interface CategorySummary {
  category: string;
  slug: string;
  count: number;
  lastModifiedAt: string | null;
}

// Props for the home page's PopularCategories block.
export interface PopularCategoriesProps {
  categories: CategorySummary[];
}

// One post as surfaced under a category — trimmed to what the accordion renders.
interface CategoryAccordionPost {
  slug: string;
  title: string;
  publishedAt: string | null;
}

// One category group: its display name, slug, post count, and its posts.
export interface CategoryAccordionItem {
  category: string;
  slug: string;
  count: number;
  posts: CategoryAccordionPost[];
}
