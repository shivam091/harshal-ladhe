import { styled } from "@linaria/react";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Stacks the two links on small screens; sits them side-by-side from the md breakpoint up.
export const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  margin-block-start: clamp(1.5rem, 2vw, 2rem);

  @media ${BREAKPOINTS.desktop} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

/*
  One style for real links and disabled placeholders keeps the pair balanced;
  negative insets collapse the shared border between the two adjacent slots.
*/
export const NavigationLink = styled.a`
  display: block;
  position: relative;
  flex: 1;
  padding: clamp(0.75rem, 1vw, 1rem);
  border: 0.0625rem solid var(--color-border-control);
  border-radius: 0.375rem;
  background-color: var(--color-bg-control);
  text-align: center;
  text-decoration: none;
  transition-property: background-color, border-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);

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
    border-radius: 0.375rem 0.375rem 0 0;
    inset: 0 0 -1px 0;
  }

  &:last-child {
    border-radius: 0 0 0.375rem 0.375rem;
    inset: -1px 0 0 0;
  }

  @media ${BREAKPOINTS.desktop} {
    &:first-child {
      border-radius: 0.375rem 0 0 0.375rem;
      inset: 0 0 0 1px;
    }

    &:last-child {
      border-radius: 0 0.375rem 0.375rem 0;
      inset: 0 1px 0 0;
    }
  }
`;

// Direction first, so readers know which way a link leads before reading its title.
export const Label = styled.span`
  display: block;
  margin-block-end: 0.5rem;
  color: var(--color-fg-control);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
`;

/*
  Page title text within a NavigationLink slot — slightly smaller than body
  so the eyebrow Label reads as the primary scannable element.
*/
export const Title = styled.span`
  font-size: 0.9em;
  line-height: 1.75;
`;
