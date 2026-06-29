import { styled } from "@linaria/react";
import { hoverShadowLiftCss, stretchedCardLinkCss, introParagraphCss } from "@/components/common.styles";

export const TutorialsSection = styled.section`
  ${introParagraphCss}
`;

// Cards vary in title/description length; a shared row structure keeps their meta blocks aligned across a line instead of staggering.
export const TutorialsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(22rem, 1fr));
  grid-auto-rows: auto 1fr auto;
  gap: 1rem;
  margin-block-start: 1rem;
  padding: 0;
  list-style: none;
`;

// Aligns to the list's shared row structure so uneven content length doesn't break the grid across cards.
export const Tutorial = styled.li`
  position: relative;
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  row-gap: 0.5rem;
  padding: 1rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.375rem;
  margin-block-end: 0;
  ${hoverShadowLiftCss}
`;

// Makes the whole card a single click target, so the description and meta below don't need their own links.
export const TutorialName = styled.h2`
  font-size: 1.25rem;
  margin-block-start: 0;

  ${stretchedCardLinkCss}
`;

// Fills leftover space so cards with short descriptions still push their meta block to a shared baseline.
export const TutorialDescription = styled.div`
  color: var(--color-fg-muted);
`;

// Set apart visually so category/date read as supporting info, not part of the description.
export const TutorialMeta = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem;
  background: var(--color-bg-cloud-300);
  border-radius: 0.1875rem;
  transition:
    background-color 350ms cubic-bezier(0.41, 0.1, 0.13, 1),
    color 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
  color: var(--color-fg-accent-muted);
`;

// Spaces stacked meta rows apart without leaving trailing space after the last one.
export const TutorialMetaItem = styled.span`
  font-size: 0.875rem;

  &:not(:last-child) {
    margin-block-end: 0.5rem;
  }
`;
