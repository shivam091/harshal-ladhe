import type { CategoryMeta } from "@/interfaces/category";

/*
  Per-category SEO/display metadata, keyed by category slug (the slugified form
  of the categories declared on each post in data/posts.ts). Drives the <h1>,
  <title>, and meta description of each /category/<slug> archive.

  Slugs not listed here still generate an archive page — lib/categories.ts falls
  back to the category name and a generated description. Entries may exist ahead
  of the posts that use them; only categories actually present on a post get a page.
*/
export const categoryMeta: Record<string, CategoryMeta> = {
  css: {
    title: "All Posts on CSS and Web Styling",
    description: "A collection of articles and tutorials on Cascading Style Sheets (CSS), covering modern layout techniques, responsive design, and best practices for web styling.",
  },
};
