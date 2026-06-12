/*
  Plain CSS text rather than styled components, so unrelated components can share a treatment by
  interpolating it into their own templates without inheriting an extra element or class.
*/

// Draws the dot separator in CSS so meta items stay clean in markup and screen readers skip it.
export const dotSeparatorCss = `
  > *:not(:last-child)::after {
    content: "";
    display: inline-block;
    inline-size: 0.25rem;
    block-size: 0.25rem;
    background: currentColor;
    border-radius: 624.9375rem;
    margin-inline: 0.5rem;
    opacity: 0.5;
    vertical-align: middle;
  }
`;

// Sizes a section's lead paragraph up from body copy so it reads as a lede, not filler text.
export const introParagraphCss = `
  p {
    font-size: clamp(1rem, 2vw, 1.125rem);
    line-height: 1.625;
    margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
  }
`;

// One keyboard-focus outline so focus looks the same on every interactive surface.
export const focusRingCss = `
  outline: 0.125rem solid var(--color-outline-focus);
  outline-offset: 0.125rem;
`;

// Hints that a card is clickable; hover-gated so a touch tap doesn't leave it stuck "hovered".
export const hoverShadowLiftCss = `
  box-shadow: var(--box-shadow-sm);
  transition: box-shadow 300ms cubic-bezier(0.25, 0.1, 0.25, 1);

  &:hover {
    @media (hover: hover) {
      box-shadow: var(--box-shadow-md);
    }
  }
`;

/*
  Makes the whole card clickable through a single title link instead of nesting links, while
  other interactive elements (e.g. category links) can still sit above the overlay.
*/
export const stretchedCardLinkCss = `
  a {
    color: var(--color-fg-default);
    text-decoration: none;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 0;
    }
  }
`;

// Keeps card heights even regardless of description length.
export const clampedDescriptionCss = `
  color: var(--color-fg-muted);
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

// Softens the edge where a sky decoration meets the page so it blends in instead of ending abruptly.
export const skyFadeGradient = (direction: "to top" | "to bottom") => `
  linear-gradient(
    ${direction},
    hsl(from var(--color-bg-sky-subtle) h s l / 0.925),
    var(--color-bg-sky-subtle)
  )
`;

/*
  Renders `color` as a fully opaque background-image even when `color` itself is a partially
  transparent token — several theme tokens (e.g. muted/danger backgrounds) are only ~10% opaque,
  so a plain background-color would let whatever's behind the element show through.
*/
export const opaqueBgCss = (color: string) => `linear-gradient(${color}, ${color})`;

/*
  One amber accent so every accent-icon surface reads as the same language; tuned per theme
  because a single lightness either washes out on white or glares on dark backgrounds.
*/
export const amberAccentCss = `
  background: oklch(0.82 0.19 97.52);
  color: black;

  html[data-theme="dark"] & {
    background: oklch(0.9 0.22 97.52);
    color: black;
  }

  html[data-theme="soft-dark"] & {
    background: oklch(0.86 0.205 97.52);
    color: black;
  }
`;

// One tag pill so every tag cloud on the site looks and behaves identically.
export const tagPillCss = `
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 624.9375rem;
  font-size: 0.875rem;
  margin-block-end: 0;
  box-shadow: var(--box-shadow-sm);
  transition-property: border-color, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.6, 0, 0.2, 1);

  /* Accent border + shadow lift on hover so tags read as clickable. */
  &:hover {
    border-color: var(--color-border-accent-muted);
    box-shadow: var(--box-shadow-md);
  }

  .tag-link {
    color: var(--color-fg-muted);
    text-decoration: none;
    font-weight: 500;
  }

  /*
    Stretched over the whole pill so the padding and count are clickable too — the count stays outside
    the link because the link's aria-label already announces it.
  */
  .tag-link::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }

  &:hover .tag-link,
  .tag-link:focus-visible {
    color: var(--color-fg-accent);
  }

  /* The ring wraps the pill rather than the text, so it outlines the area that's actually clickable. */
  .tag-link:focus-visible {
    outline: none;
  }

  &:has(.tag-link:focus-visible) {
    outline: 0.125rem solid var(--color-outline-focus);
    outline-offset: 0.125rem;
    border-color: var(--color-border-accent-muted);
  }

  .tag-count {
    display: inline-block;
    min-inline-size: 1.6em;
    padding: 0.1875rem 0.5rem;
    background-color: var(--color-bg-neutral-muted);
    color: var(--color-fg-neutral);
    font-size: 0.875rem;
    border-radius: 50rem;
    border: 0.0625rem solid var(--color-border-neutral-muted);
    text-align: center;
  }
`;
