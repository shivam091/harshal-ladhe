import type { PostSeriesInfo } from "@/data/series";

// Takes resolved series info so the badge never has to work out a post's position itself.
export interface SeriesBadgeProps {
  // The series this post belongs to, including its title and this post's position.
  series: PostSeriesInfo;
  // When true (default), the badge links to the series page; otherwise it's static.
  link?: boolean;
}
