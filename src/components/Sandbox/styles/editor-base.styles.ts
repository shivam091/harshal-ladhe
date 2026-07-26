// Base CodeMirror editor chrome: fonts, backgrounds, selection, and focus-outline resets.
export const editorBaseCss = `
  .sp-editor {
    border-inline-end: none !important;
  }

  .sp-code-editor {
    font-size: var(--font-size-sm) !important;
    line-height: var(--line-height-code) !important;
  }

  .cm-editor {
    font-family: var(--font-stack-monospace) !important;
    background: var(--color-bg-default) !important;
  }

  .cm-content,
  .cm-scroller {
    outline: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .cm-content {
    padding: var(--space-none) !important;
  }

  /*
    multicursor.ts's drawSelection() replaces native selection with its own layer (needed for multi-range selections) —
    themed here since CodeMirror hardcodes its color.
  */
  .cm-selectionBackground {
    background: var(--color-bg-selection) !important;
  }

  .cm-content ::selection,
  .cm-content::selection {
    color: var(--color-fg-selection) !important;
  }

  /*
    Kills CodeMirror's default dotted focus outline, which otherwise flashes on every Sandpack tab switch
    (auto-focus + remount).
  */
  .cm-editor.cm-focused {
    outline: none !important;
  }
`;
