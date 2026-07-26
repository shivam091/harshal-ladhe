// Base CodeMirror editor chrome: fonts, backgrounds, selection, and focus-outline resets.
export const editorBaseCss = `
  .sp-editor {
    border-inline-end: none !important;
  }

  .sp-code-editor {
    font-size: var(--sandbox-editor-font-size, var(--font-size-sm)) !important;
    line-height: var(--line-height-code) !important;
  }

  .cm-editor {
    font-family: var(--font-stack-monospace) !important;
    background: var(--color-bg-default) !important;
  }

  .cm-scroller {
    padding: var(--space-none) !important;
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
    Selection highlight for CodeMirror's custom multi-range selection layer (drawSelection), since
    CodeMirror hardcodes its own color.
  */
  .cm-selectionBackground {
    background: var(--color-bg-selection) !important;
  }

  .cm-content ::selection,
  .cm-content::selection {
    color: var(--color-fg-selection) !important;
  }

  /*
    Removes CodeMirror's default focus outline, which otherwise flashes on every tab switch
    (auto-focus + remount).
  */
  .cm-editor.cm-focused {
    outline: none !important;
  }
`;
