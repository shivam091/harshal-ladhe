import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Archives page section wrapper — intro paragraph sits above the timeline.
export const ArchivesSection = styled.section`
  p {
    font-size: var(--fluid-font-size-md);
    line-height: var(--line-height-relaxed);
    margin-block-end: var(--fluid-space-base);
  }
`;

/*
  Vertical archive timeline — a connecting spine (::after) threads through year
  markers and post nodes (::before dots). One styled wrapper owns the whole tree
  via nested class selectors, mirroring the source SCSS 1:1.
  --separator-height drives the spine segment height between adjacent nodes.
*/
export const TimelineWrapper = styled.div`
  --separator-height: var(--size-huge);

  display: flex;
  flex-direction: column;

  .timeline-posts {
    list-style: none;
    margin: var(--space-none);
    padding: var(--space-none);
  }

  .timeline-year,
  .timeline-post {
    display: flex;
    align-items: center;
    position: relative;
    gap: var(--space-md);
    padding: var(--space-sm);
    border-radius: var(--border-radius-default);
    border: var(--border-width-default) solid var(--color-border-transparent);
    z-index: 2;
  }

  .timeline-post {
    background-image: linear-gradient(var(--color-bg-accent-muted), var(--color-bg-accent-muted));
    border-color: var(--color-border-accent-muted);
    margin-block-end: var(--space-base);
    box-shadow: var(--box-shadow-sm);
    transition: box-shadow var(--motion-duration-medium) var(--motion-easing-ease);

    &:hover {
      @media (hover: hover) {
        box-shadow: var(--box-shadow-md);
      }
    }

    @media ${BREAKPOINTS.mobile} {
      .timeline-left {
        font-size: 0.85rem;
      }
    }
  }

  .timeline-left {
    flex: 0 0 5.5rem;
    text-align: end;
    font-weight: var(--font-weight-medium);
    font-variant-numeric: tabular-nums;
    color: var(--color-fg-muted);
    white-space: nowrap;

    @media ${BREAKPOINTS.mobile} {
      flex: 0 0 4rem;
    }
  }

  .timeline-year {
    .timeline-left {
      color: var(--color-fg-default);
      margin-block: var(--space-sm);
    }

    .timeline-seperator::before {
      inline-size: var(--size-base);
      block-size: var(--size-base);
      background: var(--color-bg-accent-emphasis);
      box-shadow: 0 0 8px 2px var(--color-fg-accent);
    }
  }

  .timeline-seperator {
    flex: 0 0 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;

    &::before {
      content: "";
      inline-size: var(--size-md);
      block-size: var(--size-md);
      background: var(--color-fg-accent);
      border: var(--border-width-medium) solid var(--color-border-default);
      box-shadow: 0 0 8px 1px var(--color-fg-accent);
      border-radius: var(--border-radius-full);
      z-index: 2;
    }

    &::after {
      content: "";
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform: translate(-50%, -50%);
      inline-size: var(--size-xxxs);
      block-size: var(--separator-height);
      background: var(--color-border-default);
      z-index: 1;
    }
  }

  /*
    Trim the spine so it starts at the first year's dot and ends at the last
    post's dot. Written as full descendant selectors (not nested under
    .timeline-seperator with &) because Linaria/stylis substitutes & with the
    root component class, which would misplace the .timeline-year prefix.
  */
  .timeline-year:first-of-type .timeline-seperator::after {
    transform: translate(-50%, 0);
    block-size: calc(var(--separator-height) / 2);
  }

  .timeline-year:last-of-type + .timeline-posts li:last-child .timeline-seperator::after {
    transform: translate(-50%, -100%);
    block-size: calc(var(--separator-height) / 2);
  }

  .timeline-right {
    flex: 1;
    font-weight: var(--font-weight-medium);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .post-title {
    color: var(--color-fg-link);

    @media (hover: hover) {
      text-decoration: none;
    }
  }
`;
