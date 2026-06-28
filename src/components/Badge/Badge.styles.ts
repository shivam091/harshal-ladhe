import { styled } from "@linaria/react";

// Based on an anchor so one styled root serves both linked and static badges via `as`.
export const BadgeRoot = styled.a`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: clamp(0.6875rem, 1.2vw, 0.75rem);
  font-weight: 500;
  line-height: 1.25;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  background-color: var(--color-bg-muted);
  color: var(--color-fg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  text-decoration: none;
  transition-property: border-color, color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);

  /* Hover only on link badges so static labels don't look clickable; echoes the card hover lift. */
  a&:hover {
    color: var(--color-fg-accent);
    border-color: var(--color-border-accent-muted);
    box-shadow: var(--box-shadow-sm);
    text-decoration: none;
  }
`;
