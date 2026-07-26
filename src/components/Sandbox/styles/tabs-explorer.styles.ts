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
    border-inline-end: var(--border-width-default) solid
      var(--color-border-muted);
  }

  /* Stacked (small-screen) layout: file explorer sits above the editor, not beside it — no side divider needed. */
  [data-stacked="true"] .sp-file-explorer-list {
    border-inline-end: 0;
  }

  /* File tabs pinned to 40px, matching PreviewPanel's own tab bar so the two rows align when stacked. */
  .sp-tabs {
    border-block-end: var(--border-width-default) solid var(--color-border-muted) !important;
    background: var(--color-bg-muted) !important;
    block-size: var(--size-xxl) !important;
  }

  .sp-tab-button {
    position: relative;
    display: flex;
    align-items: center;
    block-size: var(--size-xxl) !important;
    font-family: var(--font-stack-monospace) !important;
    font-size: var(--font-size-xs) !important;
  }

  .sp-tabs-scrollable-container {
    padding-block: var(--space-none) !important;
    padding-inline: var(--space-xs) !important;
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
    padding-inline-start: var(--space-none);
  }

  .sp-close-button,
  .cm-dialog-close {
    color: var(--color-fg-default) !important;
  }

  /* Accent underline on the active file tab — mirrors the output/console tab-bar treatment (see PreviewPanel.styles.ts). */
  .sp-tab-button::after {
    content: "";
    position: absolute;
    inset-inline: 0.5rem;
    inset-block-end: 0;
    block-size: 2px;
    border-start-start-radius: var(--border-radius-xs);
    border-start-end-radius: var(--border-radius-xs);
    border-end-end-radius: 0;
    border-end-start-radius: 0;
    background: var(--color-fg-accent);
    opacity: 0;
    transition: opacity var(--motion-duration-fast) ease;
  }

  .sp-tab-button[data-active="true"]::after {
    opacity: 1;
  }

  /*
    Modified-file dot — VS Code's own "differs from disk" indicator, keyed here off the sandbox's
    original template instead (see SandboxCodeEditor's tab-dotting effect, which sets data-modified
    directly on this button since Sandpack's FileTabs has no render-prop to inject a badge with).
    ::before, not ::after — that pseudo-element already draws the active-tab underline above.
  */
  .sp-tab-button[data-modified="true"]::before {
    content: "";
    position: absolute;
    inset-block-start: 0.4rem;
    inset-inline-end: 0.35rem;
    inline-size: 5px;
    block-size: 5px;
    border-radius: var(--border-radius-full);
    background: var(--color-fg-accent);
  }
`;
