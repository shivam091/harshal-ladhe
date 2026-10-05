import { styled } from "@linaria/react";

/*
  One pinned preview: a paper backing tilted by its own --tilt (set inline per card so each hangs
  slightly differently) that straightens on hover or focus-within, so a card being read or operated
  sits square. The tilt animation is dropped entirely under prefers-reduced-motion, though the
  resting tilt stays since it's static decoration.
*/
export const PinFrame = styled.figure`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
  padding: 1.25rem 0.75rem 0.75rem;
  min-inline-size: 0;
  background: color-mix(in srgb, var(--color-fg-attention) 5%, var(--color-bg-default));
  border-radius: 0.125rem;
  box-shadow:
    0 0.0625rem 0.125rem color-mix(in srgb, black 18%, transparent),
    0 0.75rem 1.25rem -0.5rem color-mix(in srgb, black 35%, transparent);
  rotate: var(--tilt, 0deg);
  transition: rotate 200ms ease, box-shadow 200ms ease;

  &:hover,
  &:focus-within {
    rotate: 0deg;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The push-pin: a glossy domed head from a radial gradient on the theme's danger red, with a soft cast shadow so it reads as standing proud of the card.
export const PushPin = styled.span`
  position: absolute;
  inset-block-start: -0.5rem;
  inset-inline-start: 50%;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  translate: -50% 0;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    color-mix(in srgb, white 70%, var(--color-fg-danger)) 0,
    var(--color-fg-danger) 45%,
    color-mix(in srgb, var(--color-fg-danger) 55%, black) 100%
  );
  box-shadow: 0.1875rem 0.25rem 0.25rem color-mix(in srgb, black 35%, transparent);
  pointer-events: none;
`;

// Platform name on the left, the surface's light/dark switch on the right.
export const CardHeader = styled.figcaption`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-fg-muted);
`;

// Icon-only toggle — compact, since there's one on every card.
export const ModeButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 50%;
  cursor: pointer;

  &:hover {
    color: var(--color-fg-default);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

/*
  The platform surface itself. Unlike the shell, these colours are deliberately fixed rather than
  theme tokens: each card's light/dark mode is chosen independently of the site's theme (people
  scroll these platforms in either mode whatever this page is set to), so the surface carries its
  own small neutral palette as local custom properties that every platform card reads from.
*/
export const Surface = styled.div`
  --surface-bg: #ffffff;
  --surface-fg: #0f1419;
  --surface-muted: #5b6670;
  --surface-border: #d6dce1;
  --surface-subtle: #f0f2f5;
  --surface-link: #1a56db;
  --surface-placeholder: #e3e7eb;

  padding: 0.75rem;
  color: var(--surface-fg);
  background: var(--surface-bg);
  border-radius: 0.25rem;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;

  &[data-mode="dark"] {
    --surface-bg: #16181c;
    --surface-fg: #e7e9ea;
    --surface-muted: #8b98a5;
    --surface-border: #3a3f45;
    --surface-subtle: #24272c;
    --surface-link: #8ab4f8;
    --surface-placeholder: #2f3338;
  }
`;
