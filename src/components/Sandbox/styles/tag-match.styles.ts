/*
  Tag-pair match highlight — colors tag-match.ts's `cm-sbx-tag-match` decoration, the equivalent of
  bracket-match.styles.ts's `.cm-matchingBracket` but for JSX/HTML tag names. Shares the same
  accent-muted background as the bracket-match highlight (same "matching pair" concept) plus an
  outline, so a tag name that already carries the same accent color from syntax highlighting still
  reads as boxed rather than just re-tinted.
*/
export const tagMatchCss = `
  .cm-sbx-tag-match {
    background: var(--color-bg-accent-muted) !important;
    outline: 1px solid var(--color-border-accent-emphasis);
    border-radius: 2px;
  }
`;
