// Props for the reusable Tags meta component.
export interface TagsProps {
  tags: string[];
  // Render each tag as a link to /tag/<slug> instead of a static badge.
  link?: boolean;
}
