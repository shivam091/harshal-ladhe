// Styles for the "Go to line" panel.
export const gotoLineCss = `
  .sandbox-goto-line-panel {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 50%;
    z-index: 600;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    inline-size: 24rem;
    max-inline-size: calc(100% - 2rem);
    background: var(--color-bg-overlay);
    border: 0.0625rem solid var(--color-border-default);
    border-block-start: none;
    border-end-start-radius: 0.375rem;
    border-end-end-radius: 0.375rem;
    box-shadow: var(--box-shadow-md);
    padding: 0.375rem 0.5rem;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.75rem !important;
    animation: sandbox-goto-line-slide-down 160ms ease-out both;
  }

  /* Closing animation. */
  .sandbox-goto-line-panel.sandbox-panel-closing {
    animation: sandbox-goto-line-slide-up 140ms ease-in both;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .sandbox-goto-line-panel,
    .sandbox-goto-line-panel.sandbox-panel-closing {
      animation-duration: 1ms;
    }
  }

  @keyframes sandbox-goto-line-slide-down {
    from {
      transform: translateX(-50%) translateY(-0.5rem);
      opacity: 0;
    }

    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }

  @keyframes sandbox-goto-line-slide-up {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    to {
      transform: translateX(-50%) translateY(-0.5rem);
      opacity: 0;
    }
  }

  .sandbox-goto-line-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  /* Line number input. */
  .sandbox-goto-line-input {
    flex: 1 1 auto;
    inline-size: 100% !important;
    block-size: 1.75rem !important;
    padding-inline: 0.375rem !important;
    border: 0.0625rem solid var(--color-border-default) !important;
    border-radius: 0.25rem !important;
    background: transparent !important;
    color: var(--color-fg-default) !important;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.75rem;
    font-weight: 400;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  .sandbox-goto-line-input:focus-visible {
    outline: none !important;
    border-color: var(--color-border-accent-emphasis) !important;
    box-shadow: 0 0 0 0.1875rem hsl(from var(--color-bg-accent-emphasis) h s l / 0.25);
  }

  /* Close button. */
  .sandbox-goto-line-panel .sandbox-goto-line-close {
    inline-size: 1.5rem;
    block-size: 1.5rem;
    flex-shrink: 0;
  }

  .sandbox-goto-line-panel .sandbox-goto-line-close svg {
    inline-size: 1.125rem;
    block-size: 1.125rem;
  }

  .sandbox-goto-line-hint {
    margin-block-start: 0.125rem;
    margin-block-end: 0;
    font-size: 0.6875rem;
    line-height: 1.375;
    color: var(--color-fg-muted);
  }

  /* Keeps the editor cursor visible while the panel is open. */
  .cm-editor:has(> .sandbox-goto-line-panel) > .cm-scroller > .cm-cursorLayer {
    animation: steps(1) cm-blink 1.2s infinite;
  }

  .cm-editor:has(> .sandbox-goto-line-panel) > .cm-scroller > .cm-cursorLayer .cm-cursor {
    display: block !important;
  }
`;
