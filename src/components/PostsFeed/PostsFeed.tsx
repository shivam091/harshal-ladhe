"use client";

import type { JSX } from "react";
import PostList from "@/components/PostList";
import Button from "@/components/Button";
import IconArrowDown from "@/icons/IconArrowDown";
import { useShowMore } from "@/hooks/use-show-more";
import { siteConfig } from "@/config/site";
import type { PostListProps } from "@/components/PostList/PostList.types";
import { ShowMoreWrapper } from "@/components/PostsFeed/PostsFeed.styles";

// Reveals posts in batches so a long feed doesn't render all at once, using the site-wide batch sizes.
export default function PostsFeed({ posts }: PostListProps): JSX.Element {
  const { visibleItems, hasMore, isLoading, showMore } = useShowMore(posts, siteConfig.pagination);

  return (
    <>
      <PostList posts={visibleItems} />

      {hasMore && (
        <ShowMoreWrapper>
          <Button
            type="button"
            size="sm"
            iconVariant="boxed"
            iconLeft={<IconArrowDown size={18} />}
            loading={isLoading}
            onClick={showMore}
          >
            Show more
          </Button>
        </ShowMoreWrapper>
      )}
    </>
  );
}

PostsFeed.displayName = "PostsFeed";
