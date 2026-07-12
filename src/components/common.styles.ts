/*
  Cross-cutting CSS snippets shared by otherwise-unrelated components — plain CSS text meant to be
  interpolated into a consumer's own styled/css template (e.g. `${dotSeparatorCss}`), not a styled
  component or css class of its own.
*/

/*
  Middle-dot separator between inline meta items, e.g. "Published: … · Read time: …". Used by
  PageMetaPrimary/PostCardFooter (PageMeta.styles.ts/PostList.styles.ts) and Sandbox MetaBar's Root.
*/
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

/*
  Focus-visible ring — the app's standard keyboard-focus outline. Used by Button's ButtonRoot/
  ButtonLink, RelatedPost's whole-card focus-within ring, and the Sandbox goto-line/search-panel
  popups' primary action buttons.
*/
export const focusRingCss = `
  outline: 0.125rem solid var(--color-outline-focus);
  outline-offset: 0.125rem;
`;

/*
  Card shadow lift on hover — box-shadow-sm at rest, deepening to box-shadow-md on hover (guarded
  by (hover: hover) so a touch tap doesn't get stuck "hovered"). Used by the post/series/goodie/
  snippet cards (PostList/series/goodies/snippets.styles.ts) and the archive timeline's post rows
  (ArchiveClient.styles.ts).
*/
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
  Stretched invisible overlay on a card's title link so the whole card is clickable, while nested
  interactive elements (e.g. category links) can opt out by sitting above it. Used by the post/
  series/related-post card titles.
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

/*
  Muted, 2-line-clamped card description — keeps card heights even regardless of description
  length. Used by the post/series/related-post cards.
*/
export const clampedDescriptionCss = `
  color: var(--color-fg-muted);
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

/*
  Sky-fade gradient — a subtle fade from a near-opaque sky-subtle tint to the full sky-subtle
  background. `direction` picks which edge it fades toward. Used by the search page's CloudBottom
  and the SkyBanner top/bottom decorations.
*/
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
  Amber accent surface — tuned per theme (deepest in light mode for contrast against a white
  page, brightest in dark, in between for soft-dark's lower-contrast palette). Used by Button's
  boxed IconBox (Button.styles.ts) and the newsletter form's SubmitBtn (SubmitButton.styles.ts),
  so every accent-icon surface across the site reads as one language.
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

/*
  Pill list item pairing a "#name" link with a muted post-count badge — used by the trending-tags
  cloud on the homepage (TrendingTags.styles.ts) and the full tag cloud on /tags (tags.styles.ts).
*/
export const tagPillCss = `
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
  transition-property: background-color, border-color, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.6, 0, 0.2, 1);

  /* Accent border + shadow lift on hover, matching the Badge component treatment. */
  &:hover {
    border-color: var(--color-border-accent-muted);
    box-shadow: var(--box-shadow-md);
  }

  .tag-link {
    color: var(--color-fg-muted);
    text-decoration: none;
    font-weight: 500;
  }

  &:hover .tag-link {
    color: var(--color-fg-accent);
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
