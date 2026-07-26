// Bracket-pair colourisation — reuses the syntax-colour tokens rather than a dedicated rainbow palette.
export const bracketsCss = `
  .cm-sbx-bracket-0 {
    color: var(--color-code-syntax-keyword) !important;
  }

  .cm-sbx-bracket-1 {
    color: var(--color-code-syntax-function) !important;
  }

  .cm-sbx-bracket-2 {
    color: var(--color-code-syntax-string) !important;
  }

  .cm-sbx-bracket-3 {
    color: var(--color-code-syntax-number) !important;
  }

  .cm-sbx-bracket-4 {
    color: var(--color-code-syntax-tag) !important;
  }

  .cm-sbx-bracket-5 {
    color: var(--color-code-syntax-entity) !important;
  }
`;
