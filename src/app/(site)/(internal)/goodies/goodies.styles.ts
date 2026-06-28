import { styled } from "@linaria/react";
import { hoverShadowLiftCss } from "@/components/common.styles";

// Fluid intro type so the copy above the grid reads comfortably at any width.
export const GoodiesSection = styled.section`
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    line-height: 1.625;
    margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
  }
`;

// auto-fill adds and drops columns with the viewport, so no breakpoints are needed.
export const GoodiesList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  gap: 1rem;
  margin-block-start: 1rem;
  padding: 0;
  list-style: none;
`;

// Full-height link makes the whole card the click target, not just its text.
export const Goodie = styled.li`
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  margin-block-end: 0;
  ${hoverShadowLiftCss}

  a {
    display: flex;
    align-items: center;
    column-gap: 1rem;
    padding-block: 0.5rem;
    padding-inline: 1rem;
    text-decoration: none;
    color: var(--color-fg-default);
    block-size: 100%;
  }
`;

// Normalises icons of differing intrinsic sizes to one footprint so the cards line up.
export const GoodieIcon = styled.div`
  svg {
    inline-size: 4rem;
    block-size: 4rem;
  }
`;

// Keeps name and description stacked as one column beside the icon.
export const GoodieDetails = styled.div``;

// A real heading so screen-reader users can jump between goodies.
export const GoodieName = styled.h2`
  font-size: 1.25rem;
  margin-block: 0.5rem;
  color: var(--color-fg-default);
`;

// Muted so the name stays the card's primary scannable text.
export const GoodieDescription = styled.div`
  color: var(--color-fg-muted);
  font-size: 1rem;
`;
