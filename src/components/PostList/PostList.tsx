"use client"

import type { JSX } from "react";
import PostCard from "@/components/PostList/PostCard";
import type { PostListProps } from "@/components/PostList/PostList.types";
import { PostFeed } from "@/components/PostList/PostList.styles";

// Static so it can render on the server; only lists that filter need the animated twin.
export default function PostList({ posts, showTypeIcon = false }: PostListProps): JSX.Element {
  return (
    <>
      <PostFeed>
        {posts.map((post, index) => (
          <PostCard
            key={`${post.type ?? "post"}-${post.slug}`}
            post={post}
            index={index}
            showTypeIcon={showTypeIcon}
          />
        ))}
      </PostFeed>
    </>
  );
}

PostList.displayName = "PostList";
