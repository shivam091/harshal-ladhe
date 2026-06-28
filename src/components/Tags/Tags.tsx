import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Badge from "@/components/Badge";
import { TagIcon } from "@/components/Icon";
import { slugify } from "@/utils/string";
import type { TagsProps } from "@/components/Tags/Tags.types";
import { PageMetaItem, PageMetaItemBadges } from "@/components/PageMeta/PageMeta.styles";

// One tag list for every content type so tag markup and a11y labelling stay consistent.
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
