import { styled } from "@linaria/react";

// One base so variants differ only in accent tokens, never in layout.
export const BaseWrapper = styled.aside`
  --aside-border-width: 3px;
  position: relative;
  margin-block: 2rem;
  padding-block: 1.5rem;
  padding-inline: 2rem;
  padding-inline-start: calc(2rem - var(--aside-border-width));
  border-inline-start: var(--aside-border-width) solid var(--color-border-transparent);
  border-radius: 0.1875rem 0.375rem 0.375rem 0.1875rem;
  font-size: 1rem;
  background-color: var(--aside-bg);
  transition:
    background-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1),
    border-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1);

  & + & {
    margin-block-start: calc(2rem * -0.5);
  }

  // Pushed right on desktop so the overhanging corner icon isn't clipped by the content column's hidden overflow.
  @media (width > 48rem) {
    margin-inline-start: 1rem;
  }

  // On mobile the border stands in for the accent line, since an overhanging edge would be clipped.
  @media (width <= 48rem) {
    border-inline-start-color: var(--aside-accent);
  }
`;

// Straddles the corner so the icon reads as a badge; hidden on narrow viewports, where it would be clipped.
export const IconWrapper = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  transform: translate(calc(-50% - 4px), -50%);
  color: var(--aside-accent);

  @media (width <= 48rem) {
    display: none;
  }

  svg {
    display: block;
  }
`;

// Offset below the sticky header so a deep link doesn't land with the title hidden underneath it.
export const Title = styled.strong`
  display: block;
  font-size: 1.125rem;
  margin-block-end: 0.25rem;
  font-weight: 600;
  scroll-margin-block-start: calc(5rem + 2rem);
`;

// Last child's block-end margin is trimmed so padding stays symmetric.
export const Content = styled.div`
  display: grid;

  & > *:first-child {
    margin-block-start: 0;
  }

  & > *:last-child {
    margin-block-end: 0;
  }
`;

// Hidden on narrow viewports, where the border takes over as the accent line.
export const LeftEdgeDesktop = styled.div`
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  inset-block-end: 0;
  block-size: 100%;
  display: flex;
  flex-direction: column;
  transform: translateX(-3px);

  @media (width <= 48rem) {
    display: none;
  }
`;

// Lets the accent line grow with any content height while the SVG cap stays a fixed size.
export const LeftEdgeFiller = styled.div`
  flex: 1;
  inline-size: 3px;
  background-color: var(--aside-accent);
  border-radius: 0 0 624.9375rem 624.9375rem;
  margin-block-start: -1px;
  transition: background-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;
