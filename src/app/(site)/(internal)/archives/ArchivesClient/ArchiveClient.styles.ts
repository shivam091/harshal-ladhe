import { styled } from "@linaria/react";
import { hoverShadowLiftCss, opaqueBgCss } from "@/components/common.styles";
import { BREAKPOINTS } from "@/constants/breakpoints";

// One wrapper owns the whole timeline through nested class selectors so it stays a 1:1 port of the original SCSS.
export const TimelineWrapper = styled.div`
  --separator-height: 4rem;

  display: flex;
  flex-direction: column;

  .timeline-items {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .timeline-year,
  .timeline-item {
    display: flex;
    align-items: center;
    position: relative;
    gap: 0.75rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    border: 0.0625rem solid var(--color-border-transparent);
    z-index: 2;
  }

  .timeline-item {
    background-image: ${opaqueBgCss("var(--color-bg-accent-muted)")};
    border-color: var(--color-border-accent-muted);
    margin-block-end: 1rem;
    ${hoverShadowLiftCss}

    @media ${BREAKPOINTS.mobile} {
      .timeline-left {
        font-size: 0.85rem;
      }
    }
  }

  .timeline-left {
    flex: 0 0 5.5rem;
    text-align: end;
    font-weight: 500;
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
      margin-block: 0.5rem;
    }

    .timeline-seperator::before {
      inline-size: 1rem;
      block-size: 1rem;
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
      inline-size: 0.75rem;
      block-size: 0.75rem;
      background: var(--color-fg-accent);
      border: 0.125rem solid var(--color-border-default);
      box-shadow: 0 0 8px 1px var(--color-fg-accent);
      border-radius: 624.9375rem;
      z-index: 2;
    }

    &::after {
      content: "";
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      transform: translate(-50%, -50%);
      inline-size: 0.125rem;
      block-size: var(--separator-height);
      background: var(--color-border-default);
      z-index: 1;
    }
  }

  /*
    Trim the spine so it starts at the first year's dot and ends at the last
    item's dot. Written as full descendant selectors (not nested under
    .timeline-seperator with &) because Linaria/stylis substitutes & with the
    root component class, which would misplace the .timeline-year prefix.
  */
  .timeline-year:first-of-type .timeline-seperator::after {
    transform: translate(-50%, 0);
    block-size: calc(var(--separator-height) / 2);
  }

  .timeline-year:last-of-type + .timeline-items li:last-child .timeline-seperator::after {
    transform: translate(-50%, -100%);
    block-size: calc(var(--separator-height) / 2);
  }

  .timeline-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
    min-width: 0;
    font-weight: 500;
  }

  .timeline-item-icon {
    flex-shrink: 0;
    color: var(--color-fg-muted);
  }

  .timeline-item-title {
    flex: 1;
    min-width: 0;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-fg-link);

    @media (hover: hover) {
      text-decoration: none;
    }
  }
`;
