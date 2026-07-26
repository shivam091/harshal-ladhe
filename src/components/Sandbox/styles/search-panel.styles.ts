import { focusRingCss } from "@/components/common.styles";

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
    gap: 0.75rem;
    background: var(--color-bg-overlay);
    border-radius: 0.75rem;
    box-shadow: var(--box-shadow-md);
    padding: 0.75rem;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.75rem !important;
  }

  /* Same Header/Heading treatment as DialogContent.styles.ts, so this popup reads as one of the app's own dialogs. */
  .sandbox-search-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-block-end: 0.75rem;
    margin-block-end: 0.75rem;
    border-block-end: 0.0625rem solid var(--color-border-muted);
    font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }

  .sandbox-search-heading {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-fg-default);
    margin-block: 0;
  }

  .sandbox-search-row {
    display: flex;
    align-items: center;
    gap: 0.25rem;
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
    inset-inline-end: 0.25rem;
    max-inline-size: 3.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    transform: translateY(-50%);
    font-size: 0.75rem;
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
    gap: 0.125rem;
  }

  .sandbox-search-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-inline-size: 1.75rem;
    block-size: 1.75rem;
    padding-inline: 0.25rem;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-fg-muted);
    background: transparent;
    border: 0.0625rem solid transparent;
    border-radius: 0.375rem;
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
    gap: 0.1875rem;
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
    block-size: 2rem !important;
    padding-inline: 0.5rem !important;
    border: 0.0625rem solid var(--color-border-default) !important;
    border-radius: 0.375rem !important;
    background: transparent !important;
    color: var(--color-fg-default) !important;
    font-size: 0.875rem;
    font-weight: 400;
    transition: border-color 150ms ease, box-shadow 150ms ease;
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
    block-size: 2rem !important;
    padding-inline: 0.5rem !important;
    background-image: none !important;
    background: var(--color-bg-control-hover) !important;
    border: 0.0625rem solid var(--color-border-control) !important;
    border-radius: 0.375rem !important;
    color: var(--color-fg-default) !important;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.75rem !important;
    font-weight: 500;
    cursor: pointer;
    transition: filter 150ms ease, transform 150ms ease;
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
    ${focusRingCss}
  }

  /* Active search-match highlights in the editor body. */
  .cm-searchMatch {
    background: var(--color-bg-accent-muted) !important;
  }

  .cm-searchMatch-selected {
    background: var(--color-bg-accent-emphasis) !important;
  }
`;
