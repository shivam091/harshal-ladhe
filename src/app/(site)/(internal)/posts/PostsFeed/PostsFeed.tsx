"use client";

import type { JSX } from "react";
import PostList from "@/components/PostList";
import Button from "@/components/Button";
import IconArrowDown from "@/icons/IconArrowDown";
import { useShowMore } from "@/hooks/use-show-more";
import { siteConfig } from "@/config/site";
import type { PostListProps } from "@/interfaces/post";
import { ShowMoreWrapper } from "@/app/(site)/(internal)/posts/PostsFeed/PostsFeed.styles";

/*
  Client wrapper around PostList that reveals posts in batches via the shared
  useShowMore hook, using siteConfig.pagination's shared batch sizes. The trigger is
  a boxed-icon Button — see Button.tsx's iconVariant="boxed".
*/
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
