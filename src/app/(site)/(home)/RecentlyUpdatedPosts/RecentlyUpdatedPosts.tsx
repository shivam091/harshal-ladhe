"use client";

import { JSX } from "react";
import Link from "next/link";
import { useBoop } from "@/hooks/use-boop";
import { inlineMarkdownToHtml } from "@/utils/markdown";
import type { RecentlyUpdatedPostsProps } from "@/interfaces/post";
import IconArrowRight from "@/icons/IconArrowRight";
import {
  RecentlyUpdatedPostsList,
  RecentlyUpdatedPostItem
} from "@/app/(site)/(home)/RecentlyUpdatedPosts/RecentlyUpdatedPosts.styles";

// One row's link — its own useBoop instance so hovering one post doesn't boop the others.
function RecentlyUpdatedPostLink({ slug, title }: { slug: string; title: string }): JSX.Element {
  const [isBooped, triggerBoop] = useBoop();

  return (
    <>
      <Link
        href={`/post/${slug}`}
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
export default function RecentlyUpdatedPosts({ posts }: RecentlyUpdatedPostsProps): JSX.Element | null {
  if (posts.length === 0) return null;

  return (
    <>
      <RecentlyUpdatedPostsList>
        {posts.map((post) => (
          <RecentlyUpdatedPostItem key={post.slug}>
            <RecentlyUpdatedPostLink slug={post.slug} title={post.title} />
          </RecentlyUpdatedPostItem>
        ))}
      </RecentlyUpdatedPostsList>
    </>
  );
}

RecentlyUpdatedPosts.displayName = "RecentlyUpdatedPosts";
