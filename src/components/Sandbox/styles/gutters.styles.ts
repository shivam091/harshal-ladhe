// Active-line highlighting and the left gutter column (line numbers, error tinting).
export const guttersCss = `
  /* Keeps an error line's red background visible even when it's also the current active line. */
  .cm-sandbox-error-line.cm-activeLine {
    background-color: var(--color-bg-danger-muted) !important;
  }

  /* Active line's highlight, squared off to match the rest of the editor's chrome. */
  .cm-activeLine {
    border-radius: 0 !important;
  }

  /* Gutter counterpart to the active-line highlight, themed to match. */
  .cm-activeLineGutter {
    background: transparent !important;
  }

  .cm-editor.cm-focused .cm-activeLineGutter {
    background: var(--color-bg-neutral-muted) !important;
  }

  /* Tints an error line's gutter red regardless of cursor position. */
  .cm-editor .cm-gutters .cm-gutterElement.cm-sandbox-error-line-gutter {
    background: var(--color-bg-danger-muted) !important;
    color: var(--color-fg-danger) !important;
  }

  /* Keeps the fold marker's own color visible over the error-gutter tint above, including on hover. */
  .cm-editor
    .cm-gutters
    .cm-gutterElement.cm-sandbox-error-line-gutter
    .cm-foldMarker {
    color: var(--color-fg-danger) !important;
  }

  /* Matches Sandpack's own gutter background, avoiding a flash of the wrong color on mount. */
  .cm-gutters {
    background-color: var(--color-bg-default);
    color: var(--color-fg-muted);
    padding: 0;
  }

  .cm-gutter {
    background: var(--color-bg-default) !important;
  }

  /* Line numbers — match editor line typography so rows stay aligned */
  .cm-lineNumbers .cm-gutterElement {
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: var(--sandbox-editor-font-size, 0.875rem) !important;
    line-height: 1.6 !important;
  }
`;
