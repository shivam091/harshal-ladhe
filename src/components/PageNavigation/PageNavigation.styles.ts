import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Stacks the two links on small screens; sits them side-by-side from the md breakpoint up.
export const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  margin-block-start: var(--fluid-space-lg);

  @media ${BREAKPOINTS.desktop} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

/*
  Control-styled link/slot. Rendered as an <a> when a destination exists, or a
  disabled <div> placeholder (data-disabled) when it does not. Negative insets
  collapse the shared border between the two adjacent slots.
*/
export const NavigationLink = styled.a`
  display: block;
  position: relative;
  flex: 1;
  padding: var(--fluid-space-md);
  border: var(--border-width-default) solid var(--color-border-control);
  border-radius: var(--border-radius-md);
  background-color: var(--color-bg-control);
  text-align: center;
  text-decoration: none;
  transition-property: background-color, border-color, box-shadow;
  transition-duration: var(--motion-duration-fast);
  transition-timing-function: var(--motion-easing-ease);

  &:not([data-disabled="true"]):hover,
  &:not([data-disabled="true"]):focus {
    background-color: var(--color-bg-control-hover);
    box-shadow: var(--box-shadow-sm);
    text-decoration: none;
  }

  &[data-disabled="true"] {
    background-color: var(--color-bg-control-disabled);
    color: var(--color-fg-control-disabled);
    border-color: var(--color-border-control-disabled);
    cursor: default;
  }

  &[data-disabled="true"] span {
    color: var(--color-fg-control-disabled);
  }

  &:first-child {
    border-radius: var(--border-radius-default) var(--border-radius-default) 0 0;
    inset: 0 0 -1px 0;
  }

  &:last-child {
    border-radius: 0 0 var(--border-radius-default) var(--border-radius-default);
    inset: -1px 0 0 0;
  }

  @media ${BREAKPOINTS.desktop} {
    &:first-child {
      border-radius: var(--border-radius-default) 0 0 var(--border-radius-default);
      inset: 0 0 0 1px;
    }

    &:last-child {
      border-radius: 0 var(--border-radius-default) var(--border-radius-default) 0;
      inset: 0 1px 0 0;
    }
  }
`;

// "Older" / "Newer" eyebrow above the title.
export const Label = styled.span`
  display: block;
  margin-block-end: var(--space-sm);
  color: var(--color-fg-control);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: var(--font-weight-bold);
`;

/*
  Page title text within a NavigationLink slot — slightly smaller than body
  so the eyebrow Label reads as the primary scannable element.
*/
export const Title = styled.span`
  font-size: 0.9em;
  line-height: var(--line-height-paragraph);
`;
