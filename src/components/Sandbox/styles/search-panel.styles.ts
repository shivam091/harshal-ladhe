// Styles for the search/replace panel.
export const searchPanelCss = `
  /* Removes CodeMirror's own panel wrapper from layout. */
  .cm-panels {
    display: contents !important;
  }

  /* Search/replace panel. */
  .sandbox-search-panel {
    position: absolute;
    inset-block-start: 0;
    inset-inline-end: 1.125rem;
    z-index: 600;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    column-gap: 0.25rem;
    inline-size: max(50%, 30rem);
    max-inline-size: calc(100% - 1.5rem);
    background: var(--color-bg-overlay);
    border: 0.0625rem solid var(--color-border-default);
    border-block-start: none;
    border-end-start-radius: 0.375rem;
    border-end-end-radius: 0.375rem;
    box-shadow: var(--box-shadow-md);
    padding: 0.25rem;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.75rem !important;
    animation: sandbox-search-slide-down 160ms ease-out both;
  }

  /* Closing animation. */
  .sandbox-search-panel.sandbox-panel-closing {
    animation: sandbox-search-slide-up 140ms ease-in both;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .sandbox-search-panel,
    .sandbox-search-panel.sandbox-panel-closing {
      animation-duration: 1ms;
    }
  }

  @keyframes sandbox-search-slide-down {
    from {
      transform: translateY(-0.5rem);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes sandbox-search-slide-up {
    from {
      transform: translateY(0);
      opacity: 1;
    }

    to {
      transform: translateY(-0.5rem);
      opacity: 0;
    }
  }

  /* Row. */
  .sandbox-search-row {
    display: contents;
  }

  .sandbox-search-row[hidden] {
    display: none;
  }

  /* Expand/collapse replace row button. */
  .sandbox-search-expand-btn {
    grid-row: span 2;
    align-items: center;
    block-size: 100% !important;    
  }

  /* Trailing controls for a row. */
  .sandbox-search-trailing {
    display: flex;
    align-items: center;
    gap: 0.1875rem;
    flex-shrink: 0;
  }

  .sandbox-search-field-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-self: stretch;
    min-inline-size: 0;
  }

  .sandbox-search-replace-row {
    .sandbox-search-field-wrap,
    .sandbox-search-trailing {
      margin-block-start: 0.5rem;
    }
  }

  .sandbox-search-field-wrap .sandbox-search-input {
    inline-size: 100% !important;
  }

  .sandbox-search-field-wrap--find .sandbox-search-input {
    padding-inline-end: 3.25rem !important;
  }

  .sandbox-search-input[aria-invalid="true"] {
    border-color: var(--color-border-danger-emphasis) !important;
  }

  .sandbox-search-count {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 0.25rem;
    max-inline-size: 3rem;
    overflow: hidden;
    text-overflow: ellipsis;
    transform: translateY(-50%);
    font-size: 0.6875rem;
    color: var(--color-fg-muted);
    white-space: nowrap;
    pointer-events: none;
  }

  .sandbox-search-count[data-empty] {
    color: var(--color-fg-danger);
  }

  .sandbox-search-toggles {
    display: inline-flex;
    align-items: center;
    gap: 0.0625rem;
    flex-shrink: 0;
  }

  .sandbox-search-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 1.5rem;
    block-size: 1.5rem;
    padding-inline: 0.1875rem;
    color: var(--color-fg-muted);
    background: transparent;
    border: 0.0625rem solid transparent;
    border-radius: 0.25rem;
    cursor: pointer;
    transition:
      background 150ms ease,
      color 150ms ease,
      border-color 150ms ease;
  }

  .sandbox-search-toggle:hover {
    background: var(--color-bg-neutral-muted);
    color: var(--color-fg-default);
  }

  .sandbox-search-toggle[aria-pressed="true"] {
    background: var(--color-bg-accent-muted);
    border-color: var(--color-border-accent-muted);
    color: var(--color-fg-accent);
  }

  .sandbox-search-nav {
    display: inline-flex;
    align-items: center;
    gap: 0.0625rem;
    flex-shrink: 0;
  }

  .sandbox-search-separator {
    inline-size: 0.0625rem;
    block-size: 1.125rem;
    flex-shrink: 0;
    background: var(--color-border-muted);
  }

  /* Icon buttons. */
  .sandbox-search-panel .sandbox-search-icon-btn {
    inline-size: 1.5rem;
    block-size: 1.5rem;
    border-radius: 0.25rem;
    flex-shrink: 0;
  }

  .sandbox-search-panel .sandbox-search-icon-btn svg {
    inline-size: 1.125rem;
    block-size: 1.125rem;
  }

  /* Find/replace input fields. */
  .sandbox-search-panel .cm-textfield {
    inline-size: auto;
    block-size: 1.75rem !important;
    padding-inline: 0.375rem !important;
    border: 0.0625rem solid var(--color-border-default) !important;
    border-radius: 0.25rem !important;
    background: transparent !important;
    color: var(--color-fg-default) !important;
    font-size: 0.75rem;
    font-weight: 400;
    transition: border-color 150ms ease, box-shadow 150ms ease;
  }

  .sandbox-search-panel .cm-textfield:focus-visible {
    outline: none !important;
    border-color: var(--color-border-accent-emphasis) !important;
    box-shadow: 0 0 0 0.1875rem hsl(from var(--color-bg-accent-emphasis) h s l / 0.25);
  }

  /* Active search-match highlights in the editor body. */
  .cm-searchMatch {
    background: var(--color-bg-accent-muted) !important;
  }

  .cm-searchMatch-selected {
    background: var(--color-bg-accent-emphasis) !important;
  }

  /* Keeps the editor cursor visible while the panel is open. */
  .cm-editor:has(.sandbox-search-panel) > .cm-scroller > .cm-cursorLayer {
    animation: steps(1) cm-blink 1.2s infinite;
  }

  .cm-editor:has(.sandbox-search-panel) > .cm-scroller > .cm-cursorLayer .cm-cursor {
    display: block !important;
  }
`;
