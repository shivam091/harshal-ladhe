import { JSX } from "react";
import Link from "next/link";
import type { TrendingTagsProps } from "@/interfaces/tag";
import {
  TrendingTagsList,
  TrendingTagItem
} from "@/app/(site)/(home)/TrendingTags/TrendingTags.styles";

/*
  Recency-weighted tag cloud for the home page — each pill links to the
  /tag/<slug> archive and shows the tag's post count. Renders nothing when
  there are no trending tags.
*/
export default function TrendingTags({ tags }: TrendingTagsProps): JSX.Element | null {
  if (tags.length === 0) return null;

  return (
    <>
      <TrendingTagsList>
        {tags.map(({ tag, slug, count }) => (
          <TrendingTagItem key={slug}>
            <Link
              href={`/tag/${slug}`}
              className="tag-link"
              rel="tag"
              aria-label={`Tag: ${tag} (${count} post${count === 1 ? "" : "s"})`}
            >
              #{tag}
            </Link>
            <span className="tag-count">{count}</span>
          </TrendingTagItem>
        ))}
      </TrendingTagsList>
    </>
  );
}

TrendingTags.displayName = "TrendingTags";
