import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";
import Link from "next/link";
import { BREAKPOINTS } from "@/constants/breakpoints";

// A class rather than a styled button so links and icon components can share the same pill look.
export const headerActionClass = css`
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 500ms ease,
    transform 500ms ease,
    background-color 300ms cubic-bezier(0.6, 0, 0.2, 1),
    border-color 300ms cubic-bezier(0.6, 0, 0.2, 1);
  transition-delay: 0s, 0s, 0s, 0s;
  transition-delay: calc(sibling-index() * 0.1s), calc(sibling-index() * 0.1s), 0s, 0s;

  @starting-style {
    opacity: 0;
    transform: translateY(calc(-1 * 0.5rem));
  }

  &:hover,
  &:focus-visible {
    background-color: var(--color-bg-control-transparent);
    border-color: var(--color-border-control-transparent-hover);
  }

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50rem;
  line-height: 1;
  background-color: var(--color-bg-control-transparent);
  color: inherit;
  border: 1px solid var(--color-border-control-transparent);
  font-size: clamp(0.8125rem, 1.4vw, 0.875rem);
  font-weight: 600;
  cursor: pointer;
  text-decoration-line: none;

  &[data-mobile-only] {
    display: none;

    @media ${BREAKPOINTS.mobile} {
      display: inline-flex;
    }
  }
`;


// Hidden on mobile, where there's no room for inline links and the drawer takes over.
export const Nav = styled.nav`
  display: flex;
  gap: 0.5rem;
  flex: auto;

  @media ${BREAKPOINTS.mobile} {
    display: none;
  }
`;

// A real list so assistive tech announces how many nav links there are.
export const NavList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & > li {
    margin-block-end: 0;
  }
`;

// Styles off aria-current so the visual and accessible "current page" state can't drift apart.
export const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration-line: none;
  font-size: 0.875rem;
  line-height: calc(1.25 / 0.875);
  color: inherit;
  padding-block: 0.25rem;
  padding-inline: 0.5rem;

  &:hover {
    @media (hover: hover) {
      text-decoration: none;
      color: var(--color-fg-default);
    }
  }

  &[aria-current="page"] {
    color: var(--color-fg-default);
    font-weight: 600;
  }
`;

// Keeps the action buttons evenly spaced as one unit at the header's end.
export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// pointer-events: none so taps on the animated icon still reach the parent button on mobile.
export const AdjustIconWrap = styled(animated.span)`
  display: inline-flex;
  pointer-events: none;
  will-change: transform;
`;

// Pushed to the trailing edge so the active item's checkmark doesn't shift its label.
export const successIconClass = css`
  margin-inline-start: auto;
  color: var(--color-fg-success);
`;
