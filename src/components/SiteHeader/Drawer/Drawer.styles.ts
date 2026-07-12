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
  inset-block-start: var(--header-height);
  inset-inline: var(--space-sm);
  inset-block-end: var(--space-sm);
  z-index: 1002;
  border-radius: var(--border-radius-md);
  padding-inline: var(--fluid-space-md);
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
  gap: var(--space-md);
  overflow-block: auto;
`;

// Mobile drawer navigation column — flex column with tight line-height.
export const DrawerNav = styled.nav`
  display: flex;
  flex-direction: column;
  line-height: var(--line-height-tight);
`;

// Unstyled list for primary drawer nav links.
export const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

// Single nav item row — bottom border and compact vertical padding.
export const NavItem = styled.li`
  padding-block: var(--space-xs);
  margin-block-end: 0;
  border-block-end: var(--border-width-default) solid var(--color-border-muted);
`;

// Full-bleed drawer nav link with active-page highlight and hover colour.
export const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding-block: var(--space-md);
  padding-inline: var(--space-sm);
  font-size: var(--font-size-sm);
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
    font-weight: var(--font-weight-semi-bold);
  }
`;

// Absolutely-positioned quick-links column anchored to the top-right of the drawer.
export const QuickLinksList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: absolute;
  inset-inline-end: var(--space-sm);
  inset-block-start: var(--space-sm);
  display: flex;
  flex-direction: column;
  padding-block-end: 6%;
`;

// Right-aligned quick-link anchor — text-end aligns the label to the right edge.
export const QuickLink = styled(Link)`
  display: block;
  padding: var(--space-sm);
  color: inherit;
  font-size: var(--font-size-sm);
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
  font-size: var(--font-size-xs);
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
  padding: var(--space-sm);
  color: inherit;
  font-weight: var(--font-weight-medium);
  text-align: center;
  text-decoration-line: none;

  &:hover {
    @media (hover: hover) {
      text-decoration-line: none;
    }
  }
`;
