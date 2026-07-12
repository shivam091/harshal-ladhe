import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";
import Link from "next/link";
import { BREAKPOINTS } from "@/constants/breakpoints";

// Staggered entry delay per button position — interpolated as plain CSS text at build time.
const nthChildIndexRules = Array.from({ length: 6 }, (_, i) =>
  `&:nth-child(${i + 1}) { --index: ${i + 1}; }`
).join("\n  ");

// Shared pill-button styles — used as className on non-button elements (RSS link, hamburger).
export const headerActionClass = css`
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 500ms ease calc(var(--index) * 0.1s),
    transform 500ms ease calc(var(--index) * 0.1s),
    background-color 300ms cubic-bezier(0.6, 0, 0.2, 1),
    border-color 300ms cubic-bezier(0.6, 0, 0.2, 1);

  @starting-style {
    opacity: 0;
    transform: translateY(calc(-1 * 0.5rem));
  }

  &:hover,
  &:focus-visible {
    background-color: var(--color-bg-control-transparent);
    border-color: var(--color-border-control-transparent-hover);
  }

  ${nthChildIndexRules}

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


// Primary navigation row — hidden below the md breakpoint where the drawer takes over.
export const Nav = styled.nav`
  display: flex;
  gap: 0.5rem;
  flex: auto;

  @media ${BREAKPOINTS.mobile} {
    display: none;
  }
`;

// Unstyled flex list that holds individual nav link items.
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

// Next.js Link for primary nav entries; highlights in the default foreground color on the active page.
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

// Flex row grouping the trailing action buttons (theme toggle, RSS, hamburger, etc.).
export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/*
  React Spring animated wrapper that drives the adjust-icon spring transition.
  pointer-events: none so taps on the span pass through to the parent button on mobile.
*/
export const AdjustIconWrap = styled(animated.span)`
  display: inline-flex;
  pointer-events: none;
  will-change: transform;
`;

// Checkmark icon shown in the trailing slot of an action button after a successful interaction.
export const successIconClass = css`
  margin-inline-start: auto;
  color: var(--color-fg-success);
`;
