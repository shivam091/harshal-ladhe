import type { JSX } from "react";
import Link from "next/link";
import type { TrendingTag } from "@/lib/trending-tags";
import {
  TrendingTagsList,
  TrendingTagItem
} from "@/app/(site)/(home)/TrendingTags/TrendingTags.styles";

// Highlights what's being written about lately; renders nothing when no tags are trending.
// Props for the home page's TrendingTags block.
interface TrendingTagsProps {
  tags: TrendingTag[];
}

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
