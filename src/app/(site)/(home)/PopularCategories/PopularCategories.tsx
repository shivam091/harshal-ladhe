import type { JSX } from "react";
import Link from "next/link";
import type { CategorySummary } from "@/lib/categories";
import {
  PopularCategoriesList,
  PopularCategoryItem,
  DottedSeparator
} from "@/app/(site)/(home)/PopularCategories/PopularCategories.styles";

// Points readers to the most-written-about topics; renders nothing when there are none.
// Props for the home page's PopularCategories block.
interface PopularCategoriesProps {
  categories: CategorySummary[];
}

export default function PopularCategories({ categories }: PopularCategoriesProps): JSX.Element | null {
  if (categories.length === 0) return null;

  return (
    <>
      <PopularCategoriesList>
        {categories.map(({ category, slug, count }) => (
          <PopularCategoryItem key={slug}>
            <Link
              href={`/category/${slug}`}
              className="category-link"
              rel="category"
              aria-label={`Category: ${category}`}
            >
              {category}
            </Link>
            <DottedSeparator aria-hidden="true" />
            <span className="posts-count">
              {count} post{count === 1 ? "" : "s"}
            </span>
          </PopularCategoryItem>
        ))}
      </PopularCategoriesList>
    </>
  );
}

PopularCategories.displayName = "PopularCategories";
