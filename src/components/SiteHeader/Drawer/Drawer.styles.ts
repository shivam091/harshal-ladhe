import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import Link from "next/link";
import { BREAKPOINTS } from "@/constants/breakpoints";

// !important is needed to beat Motion's inline display so the drawer can't linger on desktop.
export const headerDrawerClass = css`
  @media ${BREAKPOINTS.desktop} {
    display: none !important;
  }

  position: fixed;
  display: flex;
  flex-direction: column;
  // 5rem is Header's own block-size; the var clears the hero gap that pushes it down.
  inset-block-start: calc(5rem + var(--header-top-offset, 0px));
  inset-inline: 0.5rem;
  inset-block-end: 0.5rem;
  z-index: 1002;
  border-radius: 0.375rem;
  padding-inline: clamp(0.75rem, 1vw, 1rem);
  box-shadow: var(--box-shadow-md);
  background-color: var(--color-bg-default);
  color: var(--color-fg-accent-muted);
  overflow-block: auto;
`;

// Scrollbar hidden to keep the panel clean — the content still scrolls.
export const drawerContainerClass = css`
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  display: flex;
  flex: auto;
  flex-direction: column;
  gap: 0.75rem;
  overflow-block: auto;
`;

// Stacks the primary links vertically to suit a narrow, thumb-driven panel.
export const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  line-height: 1.25;
`;

// A real list so assistive tech announces how many links the menu holds.
export const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

// Dividers between rows make each tap target's bounds obvious.
export const NavItem = styled.li`
  padding-block: 0.25rem;
  margin-block-end: 0;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// Fills the whole row so the entire item is tappable; hover is gated to real hover devices to avoid sticky touch states.
export const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.75rem;
  padding-inline: 0.5rem;
  font-size: 0.875rem;
  line-height: calc(1.25 / 0.875);
  color: inherit;
  text-decoration-line: none;

  &:hover {
    @media (hover: hover) {
      color: var(--color-fg-default);
      text-decoration: none;
    }
  }

  &[aria-current="page"] {
    color: var(--color-fg-default);
    font-weight: 600;
  }
`;

// Overlaid on the sky scene so quick links reuse its space instead of adding drawer height.
export const QuickLinksList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: absolute;
  inset-inline-end: 0.5rem;
  inset-block-start: 0.5rem;
  display: flex;
  flex-direction: column;
  padding-block-end: 6%;
`;

// End-aligned to match the column's anchoring to the scene's right edge.
export const QuickLink = styled(Link)`
  display: block;
  padding: 0.5rem;
  color: inherit;
  font-size: 0.875rem;
  line-height: calc(1.25 / 0.875);
  text-align: end;
  text-decoration-line: none;

  &:hover {
    @media (hover: hover) {
      text-decoration-line: none;
      color: var(--color-fg-default);
    }
  }
`;

// A small, evenly spread row keeps legal links reachable without competing with the main nav.
export const LegalList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-evenly;
  font-size: 0.75rem;
  line-height: calc(1 / 0.75);
`;

// Drops the global list-item bottom margin, which would unbalance the single row.
export const LegalItem = styled.li`
  position: relative;
  margin-block-end: 0;
`;

// Padded block link for a comfortable tap target despite the small text.
export const LegalLink = styled(Link)`
  display: block;
  padding: 0.5rem;
  color: inherit;
  font-weight: 500;
  text-align: center;
  text-decoration-line: none;

  &:hover {
    @media (hover: hover) {
      text-decoration-line: none;
    }
  }
`;
