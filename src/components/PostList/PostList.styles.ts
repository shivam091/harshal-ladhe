import { styled } from "@linaria/react";
import {
  dotSeparatorCss,
  hoverShadowLiftCss,
  stretchedCardLinkCss,
  clampedDescriptionCss,
} from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Vertical feed of post preview cards.
export const PostFeed = styled.ul`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 1.25vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
`;

/*
  Single post preview card — scroll-driven reveal with per-card stagger via --stagger.
  The whole card is clickable via the title link's stretched ::after overlay
  (see PostCardTitle), so position:relative anchors that overlay to the card.
*/
export const PostPreview = styled.li`
  position: relative;
  opacity: 0;
  transform: translateY(32px) scale(0.98);
  will-change: transform, opacity;
  animation: reveal-post 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-timeline: view();
  animation-range: entry calc(8% + (var(--stagger) * 3%)) cover 35%;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  padding: clamp(1rem, 1.25vw, 1.5rem);
  margin-block-end: 0;
  ${hoverShadowLiftCss}

  // Scroll-driven entrance: fades and blurs in while sliding up, overshoots slightly past its resting scale/position, then settles.
  @keyframes reveal-post {
    from {
      opacity: 0;
      transform: translateY(32px) scale(0.98);
      filter: blur(4px);
    }

    60% {
      opacity: 1;
      transform: translateY(0) scale(1.01);
      filter: blur(0);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

// Card header — title and optional excerpt.
export const PostCardHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-block-end: 0.5rem;
`;

/*
  Post title link — accent colour, no underline, hover to default fg.
  The ::after stretches invisibly over the whole card so a click anywhere on
  the card navigates to the post, while nested links (categories) opt out by
  sitting above this overlay (see PostCardFooter). Keeps the markup valid —
  no anchor is nested inside another anchor.
*/
export const PostCardTitle = styled.h2`
  font-size: 1.25rem;
  margin-block-start: 0;

  ${stretchedCardLinkCss}
`;

// Short lead text under the title — muted, medium weight.
export const PostCardExcerpt = styled.div`
  color: var(--color-fg-muted);
  font-weight: 500;
  font-size: 1.125rem;
`;

// Card body — wraps PostCardDescription; exists as its own layer for spacing independent of the header.
export const PostCardBody = styled.div`
  margin-block-start: 0.75rem;
`;

// SEO description text, clamped to 2 lines so long descriptions don't stretch the card.
export const PostCardDescription = styled.div`
  ${clampedDescriptionCss}
`;

/*
  Card footer — primary meta row (published date, categories, read time).
  Same two-column/single-column reflow as PageMetaPrimary (PageMeta.styles.ts)
  so the meta row reads the same on post cards and individual post pages.
  Category links must stay clickable, so lift the categories above the title's
  ::after card overlay; the non-interactive date/read-time can stay beneath it.
*/
export const PostCardFooter = styled.footer`
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  justify-content: start;
  align-items: center;
  row-gap: 0.5rem;
  margin-block-start: 0.75rem;

  .page-categories {
    position: relative;
    z-index: 1;
  }

  ${dotSeparatorCss}

  // Dividers only make sense in the single-line desktop layout above — items
  // reflow onto multiple rows below this point, so a trailing dot would end
  // up with no adjacent item to separate.
  @media ${BREAKPOINTS.tabletAndSmaller} {
    display: grid;
    grid-auto-flow: initial;
    grid-template-columns: repeat(2, 1fr);

    > *:nth-child(even) {
      justify-self: end;
    }

    > *:not(:last-child)::after {
      display: none;
    }
  }

  @media ${BREAKPOINTS.smMobileAndSmaller} {
    grid-template-columns: 1fr;

    > *,
    > *:nth-child(even) {
      justify-self: start;
    }
  }
`;
