import { styled } from "@linaria/react";

// Goodies section wrapper — intro copy sits above the card grid.
export const GoodiesSection = styled.section`
  p {
    font-size: var(--fluid-font-size-md);
    line-height: var(--line-height-relaxed);
    margin-block-end: var(--fluid-space-base);
  }
`;

// Responsive auto-filling card grid.
export const GoodiesList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: var(--space-base);
  margin-block-start: var(--space-base);
  padding: 0;
  list-style: none;
`;

// A single goodie card.
export const Goodie = styled.li`
  background: var(--color-bg-muted);
  border: var(--border-width-default) solid var(--color-border-muted);
  border-radius: var(--border-radius-default);
  margin-block-end: var(--space-none);
  box-shadow: var(--box-shadow-sm);
  transition: box-shadow var(--motion-duration-medium) var(--motion-easing-ease);

  &:hover {
    @media (hover: hover) {
      box-shadow: var(--box-shadow-md);
    }
  }

  a {
    display: flex;
    align-items: center;
    column-gap: var(--space-base);
    padding-block: var(--space-sm);
    padding-inline: var(--space-base);
    text-decoration: none;
    color: var(--color-fg-default);
    block-size: 100%;
  }
`;

// Icon column — sizes whatever SVG it wraps to the "huge" token.
export const GoodieIcon = styled.div`
  svg {
    inline-size: var(--size-huge);
    block-size: var(--size-huge);
  }
`;

// Text column holding the name and description.
export const GoodieDetails = styled.div``;

// Name of the goodie.
export const GoodieName = styled.h2`
  font-size: var(--font-size-lg);
  margin-block: var(--space-sm);
  color: var(--color-fg-default);
`;

// Description of the goodie.
export const GoodieDescription = styled.div`
  color: var(--color-fg-muted);
  font-size: var(--font-size-base);
`;
