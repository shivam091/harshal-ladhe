// Flattened so every content type can feed the same cards without the component knowing its registry.
export interface RelatedContentItem {
  slug: string;
  href: string;
  title: string;
  excerpt?: string;
  description?: string;
  publishedAt: string | null;
}

export interface RelatedContentProps {
  items: RelatedContentItem[];
  // Pluralised display form, e.g. "Posts", so the heading and link labels name the content type.
  label: string;
  // Singular lower-case form for the per-card aria-label, e.g. "post".
  itemLabel: string;
}
