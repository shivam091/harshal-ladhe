"use client";

import type { JSX } from "react";
import PostList from "@/components/PostList";
import PushButton from "@/components/PushButton";
import IconArrowDown from "@/icons/IconArrowDown";
import { useShowMore } from "@/hooks/use-show-more";
import { siteConfig } from "@/config/site";
import { BUTTON_PRESS_SOUND } from "@/constants/sound";
import type { PostListProps } from "@/components/PostList/PostList.types";
import { ShowMoreWrapper } from "@/components/PostsFeed/PostsFeed.styles";

/*
  Client wrapper around PostList that reveals posts in batches via the shared
  useShowMore hook, using siteConfig.pagination's shared batch sizes. The trigger is
  a boxed-icon PushButton — see Button.tsx's iconVariant="boxed" and PushButton's
  shared press/release sprite sound.
*/
export default function PostsFeed({ posts }: PostListProps): JSX.Element {
  const { visibleItems, hasMore, isLoading, showMore } = useShowMore(posts, siteConfig.pagination);

  return (
    <>
      <PostList posts={visibleItems} />

      {hasMore && (
        <ShowMoreWrapper>
          <PushButton
            type="button"
            size="sm"
            iconVariant="boxed"
            iconLeft={<IconArrowDown size={18} />}
            loading={isLoading}
            onClick={showMore}
            sound={BUTTON_PRESS_SOUND}
          >
            Show more
          </PushButton>
        </ShowMoreWrapper>
      )}
    </>
  );
}

PostsFeed.displayName = "PostsFeed";
