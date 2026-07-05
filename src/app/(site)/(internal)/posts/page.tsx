import type { JSX } from "react";
import type {Metadata } from "next";
import VisuallyHidden from "@/components/VisuallyHidden";
import PostList from "@/components/PostList";
import { getSortedPosts } from "@/lib/posts";
import { PostsSection } from "@/app/(site)/(internal)/posts/posts.styles";

export const metadata: Metadata = {
  title: "Posts",
  description: "Explore in-depth articles on modern web development — JavaScript, React, Next.js, CSS, HTML, Python, Ruby on Rails, animations, and SVG. Learn concepts, patterns, and real-world techniques for building better software.",
  alternates: {
    canonical: "/posts"
  },
  openGraph: {
    title: "Posts",
    description: "Explore in-depth articles on modern web development — JavaScript, React, Next.js, CSS, HTML, Python, Ruby on Rails, animations, and SVG. Learn concepts, patterns, and real-world techniques for building better software.",
    url: "/posts",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: "Posts",
    description: "Explore in-depth articles on modern web development — JavaScript, React, Next.js, CSS, HTML, Python, Ruby on Rails, animations, and SVG. Learn concepts, patterns, and real-world techniques for building better software."
  }
};

export default function PostsPage(): JSX.Element {
  const posts = getSortedPosts();

  return (
    <>
      <PostsSection aria-labelledby="posts-list-title">
        <VisuallyHidden as="h2" id="posts-list-title">
          List of blog posts
        </VisuallyHidden>

        <p>{metadata.description as string}</p>

        <PostList posts={posts} />
      </PostsSection>
    </>
  );
}
