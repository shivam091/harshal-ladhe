import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { animated } from "@react-spring/web";
import Link from "next/link";

// Staggered entry delay per button position — interpolated as plain CSS text at build time.
const nthChildIndexRules = Array.from({ length: 6 }, (_, i) =>
  `&:nth-child(${i + 1}) { --index: ${i + 1}; }`
).join("\n  ");

// Shared pill-button styles — used as className on non-button elements (RSS link, hamburger).
export const headerActionClass = css`
  opacity: var(--opacity-full);
  transform: translateY(0);
  will-change: transform, opacity;
  transition:
    opacity var(--motion-duration-slow) ease calc(var(--index, 1) * 0.1s),
    transform var(--motion-duration-slow) ease calc(var(--index, 1) * 0.1s),
    background-color var(--motion-duration-medium) var(--motion-easing-in-out),
    border-color var(--motion-duration-medium) var(--motion-easing-in-out);

  @starting-style {
    opacity: var(--opacity-none);
    transform: translateY(calc(-1 * var(--space-sm)));
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
  padding: var(--space-sm);
  border-radius: var(--border-radius-pill);
  line-height: var(--line-height-none);
  background-color: var(--color-bg-control-transparent);
  color: inherit;
  border: 1px solid var(--color-border-control-transparent);
  font-size: var(--fluid-font-size-sm);
  font-weight: var(--font-weight-semi-bold);
  cursor: pointer;
  text-decoration-line: none;

  &[data-mobile-only] {
    display: none;

    @media (width < 48rem) {
      display: inline-flex;
    }
  }
`;


// Primary navigation row — hidden below the md breakpoint where the drawer takes over.
export const Nav = styled.nav`
  display: flex;
  gap: var(--space-sm);
  flex: auto;

  @media (width < 48rem) {
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
  gap: var(--space-sm);

  & > li {
    margin-block-end: 0;
  }
`;

// Next.js Link for primary nav entries; highlights in the default foreground color on the active page.
export const NavLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration-line: none;
  font-size: var(--font-size-sm);
  line-height: calc(1.25 / 0.875);
  color: inherit;
  padding-block: var(--space-xs);
  padding-inline: var(--space-sm);

  &:hover {
    @media (hover: hover) {
      text-decoration: none;
      color: var(--color-fg-default);
    }
  }

  &[aria-current="page"] {
    color: var(--color-fg-default);
    font-weight: var(--font-weight-semi-bold);
  }
`;

// Flex row grouping the trailing action buttons (theme toggle, RSS, hamburger, etc.).
export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
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
