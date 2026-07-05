"use client";

import type { JSX } from "react";
import { AnimatePresence } from "motion/react";
import PostCard from "@/components/PostList/PostCard";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { FILTER_ITEM_VARIANTS, FILTER_ITEM_TRANSITION, NO_MOTION_TRANSITION } from "@/constants/filter-motion";
import type { PostListProps } from "@/components/PostList/PostList.types";
import { PostFeed, PostPreviewMotion } from "@/components/PostList/PostList.styles";

/*
  Filterable twin of PostList, animated like the archives timeline. Motion drives a wrapper
  rather than the card itself, since the card's scroll-reveal CSS animation also owns
  transform and opacity and would override Motion's inline styles.
*/
export default function AnimatedPostList({ posts, showTypeIcon = false }: PostListProps): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion();
  const transition = prefersReducedMotion ? NO_MOTION_TRANSITION : FILTER_ITEM_TRANSITION;

  return (
    <>
      <PostFeed>
        {/*
          popLayout takes an exiting card out of flow straight away, so the cards that stay
          slide into place while it fades — the same effect the archives filter uses.
        */}
        <AnimatePresence initial={false} mode="popLayout">
          {posts.map((post, index) => (
            <PostPreviewMotion
              key={`${post.type ?? "post"}-${post.slug}`}
              layout="position"
              variants={FILTER_ITEM_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={transition}
            >
              <PostCard post={post} index={index} showTypeIcon={showTypeIcon} as="div" />
            </PostPreviewMotion>
          ))}
        </AnimatePresence>
      </PostFeed>
    </>
  );
}

AnimatedPostList.displayName = "AnimatedPostList";
