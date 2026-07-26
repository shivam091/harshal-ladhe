// Search panel and its find/replace controls (search.ts) ship hardcoded baseTheme colors — re-themed here to this app's design tokens.
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
    Left as normal block flow (not flex) deliberately — the panel's own <br> only reliably breaks find/replace
    rows apart in that context; flex would break it.
  */
  .cm-search {
    display: block;
    padding-block: 0.625rem !important;
    padding-inline: 0.625rem var(--space-xl) !important;
    font-family: var(--font-stack-monospace) !important;
    font-size: var(--font-size-xs) !important;
    line-height: var(--line-height-loose);
  }

  .cm-search input,
  .cm-search button,
  .cm-search label {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    color: var(--color-fg-default);
    margin-block-start: var(--space-none) !important;
    margin-inline-end: var(--space-sm) !important;
    margin-block-end: var(--space-none) !important;
    margin-inline-start: var(--space-none) !important;
  }

  /* Extra spacing above the replace row so it reads as a distinct group — applied uniformly so the row stays aligned. */
  .cm-search input[name="replace"],
  .cm-search button[name="replace"],
  .cm-search button[name="replaceAll"] {
    margin-block-start: var(--space-md) !important;
  }

  .cm-textfield {
    inline-size: 12rem;
    padding-block: var(--size-xs) !important;
    padding-inline: 0.625rem !important;
    border: var(--border-width-default) solid var(--color-border-muted) !important;
    border-radius: var(--border-radius-sm, 0.2em) !important;
    background: var(--color-bg-default) !important;
    color: var(--color-fg-default) !important;
    transition: border-color var(--motion-duration-fast) ease;
  }

  .cm-textfield:focus-visible {
    border-color: var(--color-border-accent-muted) !important;
    outline: var(--border-width-default) solid var(--color-border-accent-muted) !important;
    outline-offset: calc(-1 * var(--border-width-default));
  }

  .cm-search label {
    gap: var(--size-xs);
    padding-inline: var(--space-xxxs);
    white-space: nowrap;
    color: var(--color-fg-muted);
    cursor: pointer;
  }

  .cm-search input[type="checkbox"] {
    margin: 0 !important;
    accent-color: var(--color-fg-accent);
    cursor: pointer;
  }

  /* image none kills the default light/dark gradient so the flat background above actually shows. */
  .cm-button {
    padding-block: var(--size-xs) !important;
    padding-inline: 0.875rem !important;
    background-image: none !important;
    background: var(--color-bg-neutral-muted) !important;
    border: var(--border-width-default) solid var(--color-border-muted) !important;
    border-radius: var(--border-radius-sm, 0.2em) !important;
    color: var(--color-fg-default) !important;
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
