// The breadcrumb bar is a normal-flow element, so this file owns its full visual treatment.
export const breadcrumbBarCss = `
  .cm-sbx-breadcrumb-bar {
    display: flex;
    align-items: center;
    block-size: 28px;
    flex-shrink: 0;
    overflow: hidden;
    padding-inline: 0.75rem;
    border-block-end: 1px solid var(--color-border-muted);
    background: var(--color-bg-muted);
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
    font-size: 0.75rem;
    color: var(--color-fg-muted);
  }

  /*
    align-self:stretch is load-bearing — without it, segments of different intrinsic heights centre their own boxes,
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
    margin-inline: 0.25rem;
    color: var(--color-fg-muted);
    opacity: 0.5;
  }

  .cm-sbx-breadcrumb-empty {
    opacity: 0.5;
  }
`;
