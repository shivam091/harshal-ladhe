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
    inline-size: var(--size-xxs);
    block-size: var(--size-xxs);
    background: currentColor;
    border-radius: var(--border-radius-full);
    margin-inline: var(--space-sm);
    opacity: var(--opacity-medium);
    vertical-align: middle;
  }
`;
