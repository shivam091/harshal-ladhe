import { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Badge from "@/components/Badge";
import { TagIcon } from "@/components/Icon";
import { slugify } from "@/utils/string";
import type { TagsProps } from "@/interfaces/meta-badges";
import { PageMetaItem, PageMetaItemBadges } from "@/components/PageMeta/PageMeta.styles";

// Reusable tag list — an icon, a screen-reader label, and a badge per tag.
// Pass `link` to turn each badge into a /tag/<slug> link. Used by snippets and posts.
export default function Tags({ tags, link = false }: TagsProps): JSX.Element | null {
  if (!tags || tags.length === 0) return null;

  return (
    <>
      <PageMetaItem className="page-tags">
        <TagIcon />
        <VisuallyHidden>Tags:</VisuallyHidden>
        <PageMetaItemBadges role="list">
          {tags.map((tag) => (
            <Badge
              key={tag}
              href={link ? `/tag/${slugify(tag)}` : undefined}
              ariaLabel={`Tag: ${tag}`}
              rel="tag"
              role="listitem"
            >
              {tag}
            </Badge>
          ))}
        </PageMetaItemBadges>
      </PageMetaItem>
    </>
  );
}

Tags.displayName = "Tags";
