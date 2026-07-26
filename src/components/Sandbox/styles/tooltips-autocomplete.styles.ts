// Shared hover-tooltip chrome plus the autocomplete popup that builds on top of it.
export const tooltipsAutocompleteCss = `
  /* Generic wrapper shared by autocomplete/lint hover tooltips — CodeMirror hardcodes it gray, so it needs its own themed override. */
  .cm-tooltip {
    background: var(--color-bg-default) !important;
    border: var(--border-width-default) solid var(--color-border-muted) !important;
    border-radius: var(--border-radius-md) !important;
    color: var(--color-fg-default) !important;
  }

  /* Autocomplete popup — font/overflow on top of the shared .cm-tooltip treatment above. */
  .cm-tooltip.cm-tooltip-autocomplete {
    font-family: var(--font-stack-monospace) !important;
    font-size: var(--font-size-sm) !important;
    overflow: hidden;
  }

  .cm-tooltip-autocomplete ul li {
    padding-block: var(--space-xxxs) !important;
    padding-inline: var(--space-sm) !important;
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
