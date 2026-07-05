import type { JSX } from "react";
import Link from "next/link";
import TagPill from "@/components/TagPill";
import type { TrendingTag } from "@/lib/trending-tags";
import { TrendingTagsList } from "@/app/(site)/(home)/TrendingTags/TrendingTags.styles";

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
          <TagPill key={slug}>
            <Link
              href={`/tag/${slug}`}
              className="tag-link"
              rel="tag"
              aria-label={`Tag: ${tag} (${count} entr${count === 1 ? "y" : "ies"})`}
            >
              #{tag}
            </Link>
            <span className="tag-count">{count}</span>
          </TagPill>
        ))}
      </TrendingTagsList>
    </>
  );
}

TrendingTags.displayName = "TrendingTags";
