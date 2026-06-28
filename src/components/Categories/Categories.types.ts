// Props for the reusable Categories meta component.
export interface CategoriesProps {
  categories: string[];
  // Render each category as a link to /category/<slug> instead of a static badge.
  link?: boolean;
}
