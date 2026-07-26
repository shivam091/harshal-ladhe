// Shared hover-tooltip chrome plus the autocomplete popup that builds on top of it.
export const tooltipsAutocompleteCss = `
  /* Generic .cm-tooltip wrapper beneath autocomplete and lint tooltips — CodeMirror hardcodes it grey, so it needs its own themed override. */
  .cm-tooltip {
    background: var(--color-bg-default) !important;
    border: 0.0625rem solid var(--color-border-muted) !important;
    border-radius: 0.375rem !important;
    color: var(--color-fg-default) !important;
  }

  /* Autocomplete popup — font/overflow on top of the shared .cm-tooltip treatment above. */
  .cm-tooltip.cm-tooltip-autocomplete {
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.875rem !important;
    overflow: hidden;
  }

  .cm-tooltip-autocomplete ul li {
    padding-block: 0.125rem !important;
    padding-inline: 0.5rem !important;
  }

  .cm-tooltip-autocomplete ul li[aria-selected] {
    background: var(--color-bg-neutral-muted) !important;
    color: var(--color-fg-default) !important;
  }

  .cm-completionLabel {
    color: var(--color-fg-default);
  }

  .cm-completionDetail {
    color: var(--color-fg-muted) !important;
    font-style: normal !important;
  }

  .cm-completionMatchedText {
    color: var(--color-fg-accent) !important;
    text-decoration: none !important;
  }
`;
