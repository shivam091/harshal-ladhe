import { focusRingCss } from "@/components/common.styles";

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
    border-radius: 0.75rem;
    box-shadow: var(--box-shadow-md);
    padding: 0.75rem;
    font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  }

  /* Same Header/Heading treatment as DialogContent.styles.ts, so this popup reads as one of the app's own dialogs. */
  .sandbox-goto-line-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding-block-end: 0.75rem;
    margin-block-end: 0.75rem;
    border-block-end: 0.0625rem solid var(--color-border-muted);
  }

  .sandbox-goto-line-heading {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-fg-default);
    margin-block: 0;
  }

  .sandbox-goto-line-form {
    display: flex;
    align-items: stretch;
    gap: 0.25rem;
  }

  .sandbox-goto-line-input {
    flex: 1 1 auto;
    inline-size: 100% !important;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
  }

  /*
    Same filled/accent formula as Button.styles.ts's ButtonRoot (background/border/color from its
    data-intent="accent" + data-variant="filled" combo, plus its hover/active/focus-visible
    behavior) — this is the modal's one primary action, same role as that component's.
  */
  .sandbox-goto-line-go {
    flex-shrink: 0;
    padding-inline: 1rem !important;
    background: var(--color-bg-accent-emphasis) !important;
    border: 0.0625rem solid var(--color-border-accent-emphasis) !important;
    border-radius: 0.375rem !important;
    color: var(--color-fg-on-emphasis) !important;
    font-weight: 500;
    cursor: pointer;
    transition:
      filter 150ms ease,
      transform 150ms ease;
  }

  .sandbox-goto-line-go:hover {
    filter: brightness(1.1);
  }

  .sandbox-goto-line-go:active {
    transform: scale(0.96);
  }

  .sandbox-goto-line-go:focus-visible {
    ${focusRingCss}
  }

  .sandbox-goto-line-hint {
    margin-block-start: 0.5rem;
    font-size: 0.75rem;
    line-height: 1.375;
    color: var(--color-fg-muted);
  }
`;
