import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import Link from "next/link";
import { BREAKPOINTS } from "@/constants/breakpoints";

/*
  Force-hide above md — !important overrides Motion's inline style.
  Positioning and layout from Dialog merged in.
*/
export const headerDrawerClass = css`
  @media ${BREAKPOINTS.desktop} {
    display: none !important;
  }

  position: fixed;
  display: flex;
  flex-direction: column;
  inset-block-start: 5rem;
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

/*
  Hides the inner scroll container's scrollbar (webkit + legacy IE/Edge).
  Inner flex layout from DialogInner merged in.
*/
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

// Mobile drawer navigation column — flex column with tight line-height.
export const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  line-height: 1.25;
`;

// Unstyled list for primary drawer nav links.
export const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

// Single nav item row — bottom border and compact vertical padding.
export const NavItem = styled.li`
  padding-block: 0.25rem;
  margin-block-end: 0;
  border-block-end: 0.0625rem solid var(--color-border-muted);
`;

// Full-bleed drawer nav link with active-page highlight and hover colour.
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

// Absolutely-positioned quick-links column anchored to the top-right of the drawer.
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

// Right-aligned quick-link anchor — text-end aligns the label to the right edge.
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

// Horizontal legal-link row evenly spaced across the bottom of the drawer.
export const LegalList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-evenly;
  font-size: 0.75rem;
  line-height: calc(1 / 0.75);
`;

// Legal list item — clears the default list margin.
export const LegalItem = styled.li`
  position: relative;
  margin-block-end: 0;
`;

// Centred legal anchor — medium weight, hover suppresses underline.
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
