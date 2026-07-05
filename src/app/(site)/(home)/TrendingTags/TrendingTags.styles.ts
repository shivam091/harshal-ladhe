import { styled } from "@linaria/react";
import { tagPillCss } from "@/components/common.styles";

// Shares the tag index styling so trending tags read like the full tag cloud.
export const TrendingTagsList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(0.75rem, 1vw, 1rem);
  padding: 0;
  list-style: none;
  margin-block: 0;
`;

// A single trending-tag pill: the #name link plus a muted count badge.
export const TrendingTagItem = styled.li`
  ${tagPillCss}
`;
