// Base CodeMirror editor chrome: fonts, backgrounds, selection, and focus-outline resets.
export const editorBaseCss = `
  .sp-editor {
    border-inline-end: none !important;
  }

  .sp-code-editor {
    font-size: var(--sandbox-editor-font-size, 0.875rem) !important;
    line-height: 1.6 !important;
  }

  .cm-editor {
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    background: var(--color-bg-default) !important;
  }

  .cm-scroller {
    padding: 0 !important;
  }

  .cm-content,
  .cm-scroller {
    outline: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }

  .cm-content {
    padding: 0 !important;
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
