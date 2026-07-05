"use client";

import type { JSX } from "react";
import Link from "next/link";
import { useBoop } from "@/hooks/use-boop";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import { getPostUrl } from "@/utils/post-url";
import IconArrowRight from "@/icons/IconArrowRight";
import {
  RecentlyUpdatedPostsList,
  RecentlyUpdatedPostItem
} from "@/app/(site)/(home)/RecentlyUpdatedPosts/RecentlyUpdatedPosts.styles";

// One row's link — its own useBoop instance so hovering one post doesn't boop the others.
function RecentlyUpdatedPostLink({
  slug,
  title,
  category
}: {
  slug: string;
  title: string;
  category: string[];
}): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <Link
        href={getPostUrl({ slug, category })}
        className="recently-updated-post"
        title={title}
        aria-label={`Read post: ${title}`}
        onPointerEnter={triggerBoop}
        onFocus={triggerBoop}
      >
        <IconArrowRight isBooped={isBooped} />
        <span dangerouslySetInnerHTML={{ __html: inlineMarkdownToHtml(title) }} />
      </Link>
    </>
  );
}

/*
  Compact "Recently Updated" list for the home page — title links only.
  Renders nothing when there are no posts.
*/
// One post as surfaced in the list — trimmed to what a row renders.
interface RecentlyUpdatedPost {
  slug: string;
  title: string;
  category: string[];
}

// Props for the home page's RecentlyUpdatedPosts block.
interface RecentlyUpdatedPostsProps {
  posts: RecentlyUpdatedPost[];
}

export default function RecentlyUpdatedPosts({ posts }: RecentlyUpdatedPostsProps): JSX.Element | null {
  if (posts.length === 0) return null;

  return (
    <>
      <RecentlyUpdatedPostsList>
        {posts.map((post) => (
          <RecentlyUpdatedPostItem key={post.slug}>
            <RecentlyUpdatedPostLink slug={post.slug} title={post.title} category={post.category} />
          </RecentlyUpdatedPostItem>
        ))}
      </RecentlyUpdatedPostsList>
    </>
  );
}

RecentlyUpdatedPosts.displayName = "RecentlyUpdatedPosts";
