// Code-folding placeholder chip and the fold-gutter markers that trigger it.
export const foldingCss = `
  /* Folded-region placeholder ships with hardcoded light-mode colors; re-themed here so it isn't a stray gray chip in dark mode. */
  .cm-foldPlaceholder {
    background: var(--color-bg-neutral-muted) !important;
    border: var(--border-width-default) solid var(--color-border-muted) !important;
    color: var(--color-fg-muted) !important;
    border-radius: var(--border-radius-sm) !important;
  }

  /* Fold markers are Icon components (stroke=currentColor), so dim-at-rest/bright-on-hover is just a color rule. */
  .cm-foldGutter .cm-gutterElement {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .cm-foldMarker {
    display: flex;
    color: var(--color-fg-muted);
    transition: color var(--motion-duration-fast) ease;
  }

  .cm-foldGutter .cm-gutterElement:hover .cm-foldMarker {
    color: var(--color-fg-default);
  }
`;
