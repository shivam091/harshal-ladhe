/*
  syntax-colors.ts's finer-grained token classes — !important needed since CodeMirror unions them onto the same
  span as Sandpack's own sp-syntax-* classes.
*/
export const syntaxColorsCss = `
  .cm-sbx-comment {
    color: var(--color-code-syntax-comment) !important;
  }

  .cm-sbx-keyword {
    color: var(--color-code-syntax-keyword) !important;
  }

  .cm-sbx-string {
    color: var(--color-code-syntax-string) !important;
  }

  .cm-sbx-number {
    color: var(--color-code-syntax-number) !important;
  }

  .cm-sbx-punctuation {
    color: var(--color-fg-default) !important;
  }

  .cm-sbx-operator {
    color: var(--color-code-syntax-subtle) !important;
  }

  .cm-sbx-function {
    color: var(--color-code-syntax-function) !important;
    font-weight: bold !important;
  }

  .cm-sbx-tag {
    color: var(--color-code-syntax-tag) !important;
  }

  .cm-sbx-name {
    color: var(--color-code-syntax-name) !important;
  }

  .cm-sbx-property {
    color: var(--color-code-syntax-name) !important;
  }

  .cm-sbx-builtin {
    color: var(--color-code-syntax-builtin) !important;
  }

  .cm-sbx-entity {
    color: var(--color-code-syntax-entity) !important;
  }

  .cm-sbx-namespace {
    color: var(--color-code-syntax-namespace) !important;
  }

  .cm-sbx-decorator {
    color: var(--color-code-syntax-decorator) !important;
  }

  .cm-sbx-meta {
    color: var(--color-code-syntax-meta) !important;
  }

  .cm-sbx-symbol {
    color: var(--color-code-syntax-symbol) !important;
  }

  .cm-sbx-heading {
    color: var(--color-code-syntax-heading) !important;
  }

  .cm-sbx-deleted {
    color: var(--color-code-syntax-deleted-text) !important;
  }

  .cm-sbx-error {
    color: var(--color-code-syntax-error-text) !important;
    background: var(--color-code-syntax-error-bg) !important;
  }
`;
