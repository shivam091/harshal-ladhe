// Structural/layout overrides for Sandpack's own file explorer and tab bar chrome.
export const tabsExplorerCss = `
  .sp-wrapper {
    border-radius: 0 !important;
  }

  .sp-layout {
    border: none !important;
    border-radius: 0 !important;
    gap: 0;
  }

  .sp-file-explorer {
    border-inline-end: none !important;
    background: var(--color-bg-default) !important;
  }

  .sp-file-explorer-list {
    border-inline-end: 0.0625rem solid
      var(--color-border-muted);
  }

  /* Stacked (small-screen) layout: file explorer sits above the editor, not beside it — no side divider needed. */
  [data-stacked="true"] .sp-file-explorer-list {
    border-inline-end: 0;
  }

  /* File tabs pinned to 40px, matching PreviewPanel's own tab bar so the two rows align when stacked. */
  .sp-tabs {
    border-block-end: 0.0625rem solid var(--color-border-muted) !important;
    background: var(--color-bg-muted) !important;
    block-size: 2.5rem !important;
  }

  .sp-tab-button {
    position: relative;
    display: flex;
    align-items: center;
    block-size: 2.5rem !important;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.75rem !important;
  }

  .sp-tabs-scrollable-container {
    padding-block: 0 !important;
    padding-inline: 0.25rem !important;
  }

  /* Sandpack draws its focus ring on the tab wrapper, not the button, so the outline must be killed there. */
  .sp-tab-container:has(.sp-tab-button:focus) {
    outline: none !important;
  }

  /* Sandpack always reserves 20px end-padding for the close icon — zero it out and restore only when one actually renders. */
  .sp-tab-container {
    padding-inline-end: 0 !important;
    margin: 0;
  }

  .sp-tab-container:has(.sp-close-button) {
    padding-inline-end: 20px !important;
  }

  .sp-close-button {
    padding-inline-start: 0;
  }

  .sp-close-button,
  .cm-dialog-close {
    color: var(--color-fg-default) !important;
  }

  /* Accent underline on the active file tab, matching the preview tab bar so both rows read alike. */
  .sp-tab-button::after {
    content: "";
    position: absolute;
    inset-inline: 0.5rem;
    inset-block-end: 0;
    block-size: 2px;
    border-start-start-radius: 0.125rem;
    border-start-end-radius: 0.125rem;
    border-end-end-radius: 0;
    border-end-start-radius: 0;
    background: var(--color-fg-accent);
    opacity: 0;
    transition: opacity 150ms ease;
  }

  .sp-tab-button[data-active="true"]::after {
    opacity: 1;
  }

  /*
    Sandpack mounts a fresh CodeMirror instance for every file, so animating the new instance in is
    enough for a file switch — from a tab or the explorer — to fade rather than snap.
  */
  .sp-code-editor .cm-editor {
    animation: fade-in 200ms ease-out both;
  }

  @media (prefers-reduced-motion: reduce) {
    .sp-code-editor .cm-editor {
      animation-duration: 1ms;
    }
  }

  /*
    Modified-file dot, like VS Code's "differs from disk" indicator but keyed off the original
    template. ::before because ::after already draws the active-tab underline.
  */
  .sp-tab-button[data-modified="true"]::before {
    content: "";
    position: absolute;
    inset-block-start: 0.4rem;
    inset-inline-end: 0.35rem;
    inline-size: 5px;
    block-size: 5px;
    border-radius: 624.9375rem;
    background: var(--color-fg-accent);
  }

  .sp-tab-container[data-readonly="true"]::after {
    content: "";
    display: inline-block;
    flex-shrink: 0;
    inline-size: 0.75rem;
    block-size: 0.75rem;
    margin-inline-start: 0.25rem;
    background-color: var(--color-fg-muted);
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill-rule='evenodd' d='M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z' clip-rule='evenodd'/%3E%3C/svg%3E");
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill-rule='evenodd' d='M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z' clip-rule='evenodd'/%3E%3C/svg%3E");
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-position: center;
    mask-position: center;
  }
`;
