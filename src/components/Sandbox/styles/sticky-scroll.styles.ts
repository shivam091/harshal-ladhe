/*
  Sticky scroll (opt-in, sticky-scroll.ts) positions/sizes itself inline — this file only supplies the
  visual treatment it can't set inline.
*/
export const stickyScrollCss = `
  .cm-sbx-sticky-scroll {
    position: absolute;
    inset-inline: 0;
    z-index: 5;
    overflow: hidden;
    background: var(--color-bg-default);
    border-block-end: var(--border-width-default) solid var(--color-border-muted);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-sm);
    white-space: pre;
    padding-block: var(--space-none);
    padding-inline-start: 5px;
    padding-inline-end: var(--space-xxs);
  }

  .cm-sbx-sticky-row {
    display: flex;
    align-items: center;
    color: var(--color-fg-muted);
    cursor: pointer;
  }

  .cm-sbx-sticky-row:hover {
    background: var(--color-bg-neutral-muted);
    color: var(--color-fg-default);
  }

  /* Line-number cell for each sticky row (VS Code-style) — width set inline to match the real .cm-lineNumbers gutter. */
  .cm-sbx-sticky-linenumber {
    flex-shrink: 0;
    box-sizing: border-box;
    padding-inline-end: var(--space-sm);
    text-align: end;
    color: var(--color-fg-muted);
    opacity: var(--opacity-medium);
  }

  /* Blank stand-in for the fold/lint gutter space beside the line numbers, so sticky-row text aligns with the real code below. */
  .cm-sbx-sticky-gutter-spacer {
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .cm-sbx-sticky-linetext {
    flex: 1;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-inline-end: var(--space-sm);
  }
`;
