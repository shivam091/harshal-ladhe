import type { JSX } from "react";
import type {Metadata } from "next";
import PostList from "@/components/PostList";
import TrendingTags from "@/app/(site)/(home)/TrendingTags";
import PopularCategories from "@/app/(site)/(home)/PopularCategories";
import RecentlyUpdatedEntries from "@/app/(site)/(home)/RecentlyUpdatedEntries";
import { getPinnedPosts, getFeaturedPosts } from "@/lib/posts";
import { getRecentlyUpdatedEntries } from "@/lib/taxonomy";
import { getTaxonomyEntryUrl } from "@/utils/taxonomy-entries";
import { getPopularCategories } from "@/lib/categories";
import { getTrendingTags } from "@/lib/trending-tags";
import { siteConfig } from "@/config/site";
import {
  ContentGrid,
  HomeSection,
  SectionHeading
} from "@/app/(site)/(home)/home.styles";

/*
  Title is absolute so the root layout's `%s | ${siteConfig.name}` template
  doesn't double up the site name on the home page itself.
*/
export const metadata: Metadata = {
  title: { absolute: siteConfig.name },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    type: "website"
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description
  }
};

/*
  Curated sections give first-time readers several ways in; each hides itself when disabled
  in config or empty.
*/
export default function HomePage(): JSX.Element {
  const pinnedPosts = getPinnedPosts();
  const featuredPosts = getFeaturedPosts();
  const trendingTags = getTrendingTags();
  const popularCategories = getPopularCategories();
  // Trimmed to what a row renders so the client component isn't sent full entries.
  const recentlyUpdatedEntries = getRecentlyUpdatedEntries().map((entry) => ({
    type: entry.type,
    slug: entry.slug,
    title: entry.title,
    href: getTaxonomyEntryUrl(entry)
  }));

  return (
    <>
      <ContentGrid>
        {pinnedPosts.length > 0 && (
          <HomeSection className="pinned-posts" aria-labelledby="pinned-posts-heading">
            <SectionHeading id="pinned-posts-heading">Pinned Posts</SectionHeading>
            <PostList posts={pinnedPosts} />
          </HomeSection>
        )}

        {featuredPosts.length > 0 && (
          <HomeSection className="featured-posts" aria-labelledby="featured-posts-heading">
            <SectionHeading id="featured-posts-heading">Featured Posts</SectionHeading>
            <PostList posts={featuredPosts} />
          </HomeSection>
        )}

        {trendingTags.length > 0 && (
          <HomeSection className="trending-tags" aria-labelledby="trending-tags-heading">
            <SectionHeading id="trending-tags-heading">Trending Tags</SectionHeading>
            <TrendingTags tags={trendingTags} />
          </HomeSection>
        )}

        {popularCategories.length > 0 && (
          <HomeSection className="popular-categories" aria-labelledby="popular-categories-heading">
            <SectionHeading id="popular-categories-heading">Popular Categories</SectionHeading>
            <PopularCategories categories={popularCategories} />
          </HomeSection>
        )}

        {recentlyUpdatedEntries.length > 0 && (
          <HomeSection className="recently-updated" aria-labelledby="recently-updated-heading">
            <SectionHeading id="recently-updated-heading">Recently Updated</SectionHeading>
            <RecentlyUpdatedEntries entries={recentlyUpdatedEntries} />
          </HomeSection>
        )}
      </ContentGrid>
    </>
  );
}
