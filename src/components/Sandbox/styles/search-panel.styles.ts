// Find/replace panel (custom Panel via search({ createPanel }), see Editor/extensions/search-panel.ts)
// and the "×"/close chrome CodeMirror ships around it — re-themed here to this app's design tokens.
export const searchPanelCss = `
  .cm-panels {
    background: var(--color-bg-muted) !important;
    color: var(--color-fg-default) !important;
    /* Continues SplitPane's own divider seam — only meaningful in horizontal layout, removed below when stacked. */
    border-inline-end: var(--border-width-default) solid var(--color-border-muted) !important;
  }

  [data-stacked="true"] .cm-panels {
    border-inline-end: 0 !important;
  }

  .cm-panels-top {
    border-block-end: var(--border-width-default) solid var(--color-border-muted) !important;
  }

  .cm-panels-bottom {
    border-block-start: var(--border-width-default) solid var(--color-border-muted) !important;
  }

  /*
    position:relative so .sandbox-search-close (a corner-pinned button, not part of either row's
    flow) can anchor to the panel itself.
  */
  .sandbox-search-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding-block: var(--space-sm);
    padding-inline: var(--space-sm);
    padding-inline-end: calc(var(--space-sm) + 2rem + var(--space-xs));
    font-family: var(--font-stack-monospace) !important;
    font-size: var(--font-size-xs) !important;
  }

  .sandbox-search-row {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    flex-wrap: wrap;
  }

  .sandbox-search-field-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  /*
    Fixed (not flex-grown) width, shared with .cm-textfield's own default — this is what keeps the
    search and replace fields the same size across both rows, so the buttons that follow each one
    line up instead of drifting depending on how much trailing content its own row has.
  */
  .sandbox-search-input {
    inline-size: 12rem !important;
  }

  .sandbox-search-field-wrap .sandbox-search-input {
    padding-inline-end: 3.5rem !important;
  }

  .sandbox-search-input[aria-invalid="true"] {
    border-color: var(--color-border-danger-emphasis) !important;
  }

  .sandbox-search-count {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: var(--space-xs);
    max-inline-size: 3.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    transform: translateY(-50%);
    font-size: var(--font-size-xs);
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
    gap: var(--space-xxxs);
  }

  .sandbox-search-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 2rem;
    block-size: 2rem;
    padding-inline: var(--space-xs);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-fg-muted);
    background: transparent;
    border: var(--border-width-default) solid transparent;
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    transition:
      background var(--motion-duration-fast) ease,
      color var(--motion-duration-fast) ease,
      border-color var(--motion-duration-fast) ease;
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
    gap: var(--space-xxs);
  }

  /*
    Overrides toolbarIconButtonCx's 1.75rem default so these buttons stay square against the
    taller (2rem) .cm-textfield in this panel, without changing that shared class app-wide.
  */
  .sandbox-search-icon-btn {
    flex-shrink: 0;
    inline-size: 2rem;
    block-size: 2rem;
  }

  /*
    Same plain look as the goto-line card's and the file tabs' close buttons — pinned to this
    panel's own top-right corner since, unlike those, there's no dedicated header row to sit in.
  */
  .sandbox-search-close {
    position: absolute;
    inset-block-start: var(--space-sm);
    inset-inline-end: var(--space-sm);
  }

  /*
    block-size set explicitly (not just padding-block) so the goto-line input and the
    find/replace inputs — both .cm-textfield — get a predictable, taller row instead of one
    that drifts with font metrics.
  */
  .cm-textfield {
    inline-size: 12rem;
    block-size: 1.75rem !important;
    padding-inline: 0.625rem !important;
    border: var(--border-width-default) solid var(--color-border-muted) !important;
    border-radius: var(--border-radius-sm) !important;
    background: var(--color-bg-default) !important;
    color: var(--color-fg-default) !important;
    transition: border-color var(--motion-duration-fast) ease;
  }

  .cm-textfield:focus-visible {
    border-color: var(--color-border-accent-muted) !important;
    outline: var(--border-width-default) solid var(--color-border-accent-muted) !important;
    outline-offset: calc(-1 * var(--border-width-default));
  }

  /* image none kills the default light/dark gradient so the flat background above actually shows. */
  .cm-button {
    block-size: 1.75rem !important;
    padding-inline: 0.625rem !important;
    background-image: none !important;
    background: var(--color-bg-neutral-muted) !important;
    border: var(--border-width-default) solid var(--color-border-muted) !important;
    border-radius: var(--border-radius-sm) !important;
    color: var(--color-fg-default) !important;
    font-family: var(--font-stack-monospace) !important;
    font-size: var(--font-size-xs) !important;
    cursor: pointer;
    transition:
      background var(--motion-duration-fast) ease,
      border-color var(--motion-duration-fast) ease;
  }

  .cm-button:hover {
    background-image: none !important;
    background: var(--color-bg-neutral-emphasis) !important;
    border-color: var(--color-border-accent-muted) !important;
  }

  .cm-button:active {
    background-image: none !important;
    background: var(--color-bg-accent-muted) !important;
  }

  /* Active search-match highlights in the editor body. */
  .cm-searchMatch {
    background: var(--color-bg-accent-muted) !important;
  }

  .cm-searchMatch-selected {
    background: var(--color-bg-accent-emphasis) !important;
  }
`;
