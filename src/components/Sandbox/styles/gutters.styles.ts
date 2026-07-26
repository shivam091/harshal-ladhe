// Active-line highlighting and the left gutter column (line numbers, error tinting).
export const guttersCss = `
  /*
    Overrides Sandpack's active-line background here since baseTheme rules (error-line.ts) always lose to
    it regardless of specificity.
  */
  .cm-sandbox-error-line.cm-activeLine {
    background-color: var(--color-bg-danger-muted) !important;
  }

  /* Sandpack rounds the active line's corners by default; squared off to match the rest of the editor chrome. */
  .cm-activeLine {
    border-radius: 0 !important;
  }

  /*
    active-line-gutter.ts adds the gutter counterpart Sandpack omits; re-themed to Sandpack's own surface3
    token instead of CodeMirror's hardcoded hex.
  */
  .cm-activeLineGutter {
    background: transparent !important;
  }

  .cm-editor.cm-focused .cm-activeLineGutter {
    background: var(--color-bg-neutral-muted) !important;
  }

  /*
    Tints an error line's gutter red regardless of cursor position — kept one class deeper than the
    active-line-gutter rule so specificity (not source order) decides ties.
  */
  .cm-editor .cm-gutters .cm-gutterElement.cm-sandbox-error-line-gutter {
    background: var(--color-bg-danger-muted) !important;
    color: var(--color-fg-danger) !important;
  }

  /*
    Fold marker has its own explicit color rule that beats inheritance from the red gutter above —
    reasserted here, including on hover.
  */
  .cm-editor
    .cm-gutters
    .cm-gutterElement.cm-sandbox-error-line-gutter
    .cm-foldMarker {
    color: var(--color-fg-danger) !important;
  }

  /* Matches Sandpack's own gutter background (surface1) instead of overriding it, avoiding a visible flash on mount. */
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
    font-family: var(--font-stack-monospace) !important;
    font-size: var(--font-size-sm) !important;
    line-height: var(--line-height-code) !important;
  }
`;
