// Floating "Go to line" card (Mod-Alt-G), rendered by Editor/extensions/goto-line.ts directly into
// .cm-editor rather than through CodeMirror's own docked-panel system — styled to match the
// Dialog component's centered-card look (see DialogContent.styles.ts) without pulling in Radix,
// since this lives inside a vanilla-DOM CodeMirror extension, not the React tree.
export const gotoLineCss = `
  .sandbox-goto-line-overlay {
    position: absolute;
    inset: 0;
    z-index: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    background: hsl(0deg 0% 0% / 0.35);
  }

  .sandbox-goto-line-card {
    inline-size: min(90%, 20rem);
    background: var(--color-bg-overlay);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--box-shadow-md);
    padding: var(--space-md);
    font-family: var(--font-stack-system);
  }

  /* Same Header/Heading treatment as DialogContent.styles.ts, so this popup reads as one of the app's own dialogs. */
  .sandbox-goto-line-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    padding-block-end: var(--space-md);
    margin-block-end: var(--space-md);
    border-block-end: var(--border-width-default) solid var(--color-border-muted);
  }

  .sandbox-goto-line-heading {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semi-bold);
    color: var(--color-fg-default);
    margin-block: var(--space-none);
  }

  .sandbox-goto-line-form {
    display: flex;
    align-items: stretch;
    gap: var(--space-xs);
  }

  .sandbox-goto-line-input {
    flex: 1 1 auto;
    inline-size: 100% !important;
    font-family: var(--font-stack-monospace) !important;
  }

  /*
    Same filled/accent formula as Button.styles.ts's ButtonRoot (background/border/color from its
    data-intent="accent" + data-variant="filled" combo, plus its hover/active/focus-visible
    behavior) — this is the modal's one primary action, same role as that component's.
  */
  .sandbox-goto-line-go {
    flex-shrink: 0;
    padding-inline: var(--space-base) !important;
    background: var(--color-bg-accent-emphasis) !important;
    border: var(--border-width-default) solid var(--color-border-accent-emphasis) !important;
    border-radius: var(--border-radius-default) !important;
    color: var(--color-fg-on-emphasis) !important;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition:
      filter var(--motion-duration-fast) ease,
      transform var(--motion-duration-fast) ease;
  }

  .sandbox-goto-line-go:hover {
    filter: brightness(1.1);
  }

  .sandbox-goto-line-go:active {
    transform: scale(0.96);
  }

  .sandbox-goto-line-go:focus-visible {
    outline: var(--outline-focus-width) solid var(--color-outline-focus);
    outline-offset: var(--outline-focus-offset);
  }

  .sandbox-goto-line-hint {
    margin-block-start: var(--space-sm);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-snug);
    color: var(--color-fg-muted);
  }
`;
