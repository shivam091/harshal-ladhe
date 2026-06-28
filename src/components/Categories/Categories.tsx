import type { JSX } from "react";
import VisuallyHidden from "@/components/VisuallyHidden";
import Badge from "@/components/Badge";
import { DiamondsIcon } from "@/components/Icon";
import { slugify } from "@/utils/string";
import type { CategoriesProps } from "@/components/Categories/Categories.types";
import { PageMetaItem, PageMetaItemBadges } from "@/components/PageMeta/PageMeta.styles";

// Links are opt-in so category badges can appear where a /category archive link isn't wanted.
export default function Categories({ categories, link = false }: CategoriesProps): JSX.Element | null {
  if (!categories || categories.length === 0) return null;

  return (
    <>
      <PageMetaItem className="page-categories">
        <DiamondsIcon />
        <VisuallyHidden>Categories:</VisuallyHidden>
        <PageMetaItemBadges role="list">
          {categories.map((category) => (
            <Badge
              key={category}
              href={link ? `/category/${slugify(category)}` : undefined}
              ariaLabel={`Category: ${category}`}
              rel="category"
              role="listitem"
            >
              {category}
            </Badge>
          ))}
        </PageMetaItemBadges>
      </PageMetaItem>
    </>
  );
}

Categories.displayName = "Categories";
