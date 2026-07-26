// Opt-in breadcrumb bar (breadcrumb-bar.ts) — a normal-flow element, so this file owns its full visual treatment.
export const breadcrumbBarCss = `
  .cm-sbx-breadcrumb-bar {
    display: flex;
    align-items: center;
    block-size: 28px;
    flex-shrink: 0;
    overflow: hidden;
    padding-inline: var(--space-md);
    border-block-end: 1px solid var(--color-border-muted);
    background: var(--color-bg-muted);
    font-family: var(--font-stack-monospace);
    font-size: var(--font-size-xs);
    color: var(--color-fg-muted);
  }

  /*
    align-self:stretch is load-bearing — without it, segments of different intrinsic heights center their own boxes,
    not their content, against each other.
  */
  .cm-sbx-breadcrumb-segment {
    display: inline-flex;
    align-items: center;
    align-self: stretch;
    border: none;
    background: transparent;
    padding: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    white-space: nowrap;
  }

  .cm-sbx-breadcrumb-segment:hover {
    color: var(--color-fg-default);
    text-decoration: underline;
  }

  /*
    A real ChevronRightIcon component (same one the fold gutter uses), not a CSS-content glyph, so both
    chevrons render identically.
  */
  .cm-sbx-breadcrumb-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    margin-inline: var(--space-xs);
    color: var(--color-fg-muted);
    opacity: var(--opacity-medium);
  }

  .cm-sbx-breadcrumb-empty {
    opacity: var(--opacity-medium);
  }
`;
