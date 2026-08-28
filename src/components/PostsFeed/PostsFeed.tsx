"use client";

import type { JSX } from "react";
import PostList from "@/components/PostList";
import AnimatedPostList from "@/components/PostList/AnimatedPostList";
import Button from "@/components/Button";
import IconArrowDown from "@/icons/IconArrowDown";
import { useShowMore } from "@/hooks/use-show-more";
import { siteConfig } from "@/config/site";
import type { PostListProps } from "@/components/PostList/PostList.types";
import { ShowMoreWrapper } from "@/components/PostsFeed/PostsFeed.styles";

// Feeds whose items change after load (via filters) opt into the animated list.
interface PostsFeedProps extends PostListProps {
  animateChanges?: boolean;
}

// Reveals posts in batches so a long feed doesn't render all at once, using the site-wide batch sizes.
export default function PostsFeed({ posts, showTypeIcon, animateChanges = false }: PostsFeedProps): JSX.Element {
  const { visibleItems, hasMore, isLoading, showMore } = useShowMore(posts, siteConfig.pagination);

  return (
    <>
      {animateChanges ? (
        <AnimatedPostList posts={visibleItems} showTypeIcon={showTypeIcon} />
      ) : (
        <PostList posts={visibleItems} showTypeIcon={showTypeIcon} />
      )}

      {hasMore && (
        <ShowMoreWrapper>
          <Button
            type="button"
            size="sm"
            iconVariant="boxed"
            iconLeft={<IconArrowDown size={18} />}
            loading={isLoading}
            data-analytics-event="show_more"
            data-analytics-label="posts"
            data-analytics-category="engagement"
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
