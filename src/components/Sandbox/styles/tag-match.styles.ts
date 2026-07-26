/*
  Shares the bracket-match background (the same "matching pair" idea) plus an outline, so a tag
  name already tinted by syntax colours still reads as boxed rather than re-tinted.
*/
export const tagMatchCss = `
  .cm-sbx-tag-match {
    background: var(--color-bg-accent-muted) !important;
    outline: 1px solid var(--color-border-accent-emphasis);
    border-radius: 2px;
  }
`;
