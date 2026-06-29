// Narrowed to what both post and content registries can supply, so one component serves every article page.
export interface ArticleJsonLdProps {
  // Tutorials and snippets are TechArticle; posts are BlogPosting.
  type: "BlogPosting" | "TechArticle";
  // May contain inline markdown — stripped before it reaches the schema.
  title: string;
  description: string;
  // Site-relative path; made absolute because structured data is read outside the page.
  url: string;
  // Relative or absolute; optional because not every post has a cover image.
  image?: { path: string; width: number; height: number };
  // Omitted when git has no date yet (uncommitted file).
  publishedAt?: string;
  lastModifiedAt?: string;
  tags?: string[];
  // Arrives as an MDX string attribute, hence the loose type.
  words?: string | number;
  // Links a series part back to its series page, so search engines see the reading order.
  series?: { title: string; url: string; index: number };
}
