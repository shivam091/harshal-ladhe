import { styled } from "@linaria/react";
import { motion } from "motion/react";
import {
  dotSeparatorCss,
  hoverShadowLiftCss,
  stretchedCardLinkCss,
  clampedDescriptionCss,
} from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Positioned so popLayout can lift exiting cards out of flow relative to the feed.
export const PostFeed = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 1.25vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
`;

// Bare list item that Motion moves and fades, leaving the card's own reveal animation untouched.
export const PostPreviewMotion = styled(motion.li)`
  margin: 0;
`;

/*
  Anchors the title link's stretched overlay so a click anywhere on the card navigates; the
  staggered reveal keeps a screenful of cards from appearing all at once.
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

  // A slight overshoot gives cards a springy arrival rather than a flat fade.
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
  A stretched ::after overlay makes the whole card clickable without nesting anchors, keeping
  the markup valid; nested links like categories sit above it.
*/
export const PostCardTitle = styled.h2`
  font-size: 1.25rem;
  margin-block-start: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  // Sits inline with the first line of the title so long titles still wrap naturally beneath it.
  .post-type-icon {
    margin-inline-end: 0.5rem;
    vertical-align: -0.125em;
    color: var(--color-fg-muted);
  }

  ${stretchedCardLinkCss}
`;

// Muted so the excerpt supports the title rather than competing with it.
export const PostCardExcerpt = styled.div`
  color: var(--color-fg-muted);
  font-weight: 500;
  font-size: 1.125rem;
`;

// Its own layer so body spacing stays independent of the header.
export const PostCardBody = styled.div`
  margin-block-start: 0.75rem;
`;

// SEO description text, clamped to 2 lines so long descriptions don't stretch the card.
export const PostCardDescription = styled.div`
  ${clampedDescriptionCss}
`;

/*
  Reflows like the page meta row so post cards and post pages read the same way. Categories
  are lifted above the card overlay so their links stay clickable.
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
