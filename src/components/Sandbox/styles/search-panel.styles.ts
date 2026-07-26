// Find/replace popup (custom Panel via search({ createPanel }), see Editor/extensions/search-panel.ts),
// styled as a floating centered card — same treatment as goto-line.styles.ts's popup — rather than
// CodeMirror's default docked top/bottom panel.
export const searchPanelCss = `
  /*
    CodeMirror inserts the panel's dom inside its own .cm-panels wrapper — a docked, sticky bar
    that only takes up space via in-flow content. Since our dom is itself an absolute inset:0
    overlay, that wrapper would collapse to zero height (nothing left in-flow to size it) and
    our overlay would then measure inset:0 against that zero-height box instead of the editor.
    display:contents removes the wrapper from layout entirely, so .sandbox-search-overlay below
    sizes against .cm-editor (the next real ancestor, already position:relative) instead — the
    same positioned ancestor goto-line.ts's card uses.
  */
  .cm-panels {
    display: contents !important;
  }

  .sandbox-search-overlay {
    position: absolute;
    inset: 0;
    z-index: 600;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-block-start: 10%;
    background: hsl(0deg 0% 0% / 0.35);
  }

  .sandbox-search-card {
    inline-size: min(92%, 30rem);
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    background: var(--color-bg-overlay);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--box-shadow-md);
    padding: var(--space-md);
    font-family: var(--font-stack-monospace) !important;
    font-size: var(--font-size-xs) !important;
  }

  /* Same Header/Heading treatment as DialogContent.styles.ts, so this popup reads as one of the app's own dialogs. */
  .sandbox-search-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-md);
    padding-block-end: var(--space-md);
    margin-block-end: var(--space-md);
    border-block-end: var(--border-width-default) solid var(--color-border-muted);
    font-family: var(--font-stack-system);
  }

  .sandbox-search-heading {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semi-bold);
    color: var(--color-fg-default);
    margin-block: var(--space-none);
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
    min-inline-size: 1.75rem;
    block-size: 1.75rem;
    padding-inline: var(--space-xs);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--color-fg-muted);
    background: transparent;
    border: var(--border-width-default) solid transparent;
    border-radius: var(--border-radius-default);
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
    toolbarIconButtonCx already defaults to 1.75rem — same size as .cm-textfield/.cm-button below
    — so no override is needed here for row alignment; this class is just a hook for the shared
    class's flex-shrink.
  */
  .sandbox-search-icon-btn {
    flex-shrink: 0;
  }

  /*
    Same border/radius/background/font/focus formula as the app's real form controls (see
    ContactForm.styles.ts's shared input styles) — border-color + a soft accent box-shadow halo
    on focus, no outline — so these read as one of the app's own inputs, not a bespoke CodeMirror
    field. block-size is fixed (rather than derived from padding) so it lines up with the 1.75rem
    icon buttons beside it.
  */
  .cm-textfield {
    inline-size: auto;
    block-size: var(--size-xl) !important;
    padding-inline: var(--space-sm) !important;
    border: var(--border-width-default) solid var(--color-border-default) !important;
    border-radius: var(--border-radius-default) !important;
    background: transparent !important;
    color: var(--color-fg-default) !important;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-base);
    transition: border-color var(--motion-duration-fast) ease, box-shadow var(--motion-duration-fast) ease;
  }

  .cm-textfield:focus-visible {
    outline: none !important;
    border-color: var(--color-border-accent-emphasis) !important;
    box-shadow: 0 0 0 0.25rem hsl(from var(--color-bg-accent-emphasis) h s l / 0.25);
  }

  /*
    image none kills the default light/dark gradient so the flat background above actually shows.
    Otherwise the same default-intent/soft-variant formula as Button.styles.ts's ButtonRoot
    (background/border/color from its --btn-muted-bg/--btn-muted-border/--btn-plain-fg trio, plus
    its hover/active/focus-visible behavior) — these are secondary actions, same role as that
    variant's.
  */
  .cm-button {
    block-size: var(--size-xl) !important;
    padding-inline: var(--space-sm) !important;
    background-image: none !important;
    background: var(--color-bg-control-hover) !important;
    border: var(--border-width-default) solid var(--color-border-control) !important;
    border-radius: var(--border-radius-default) !important;
    color: var(--color-fg-default) !important;
    font-family: var(--font-stack-monospace) !important;
    font-size: var(--font-size-xs) !important;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: filter var(--motion-duration-fast) ease, transform var(--motion-duration-fast) ease;
  }

  .cm-button:hover {
    background-image: none !important;
    filter: brightness(1.06);
  }

  .cm-button:active {
    background-image: none !important;
    transform: scale(0.96);
  }

  .cm-button:focus-visible {
    outline: var(--outline-focus-width) solid var(--color-outline-focus);
    outline-offset: var(--outline-focus-offset);
  }

  /* Active search-match highlights in the editor body. */
  .cm-searchMatch {
    background: var(--color-bg-accent-muted) !important;
  }

  .cm-searchMatch-selected {
    background: var(--color-bg-accent-emphasis) !important;
  }
`;
