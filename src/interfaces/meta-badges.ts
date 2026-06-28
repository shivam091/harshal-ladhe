// Props for the reusable Tags meta component.
export interface TagsProps {
  tags: string[];
  // Render each tag as a link to /tag/<slug> instead of a static badge.
  link?: boolean;
}

// Props for the reusable Categories meta component.
export interface CategoriesProps {
  categories: string[];
  // Render each category as a link to /category/<slug> instead of a static badge.
  link?: boolean;
}
