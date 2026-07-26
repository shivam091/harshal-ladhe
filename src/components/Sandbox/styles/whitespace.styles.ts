// Visible whitespace (whitespace.ts) — only within the current selection, unlike CodeMirror's own document-wide highlightWhitespace().
export const whitespaceCss = `
  .cm-highlightSpace,
  .cm-highlightTab,
  .cm-sbx-blank-line-selected:has(> br:only-child) {
    position: relative;
  }

  .cm-highlightSpace,
  .cm-highlightTab {
    background: none !important;
  }

  .cm-highlightSpace::before,
  .cm-highlightTab::before,
  .cm-sbx-blank-line-selected:has(> br:only-child)::before {
    color: var(--color-fg-muted);
    opacity: var(--opacity-low);
    pointer-events: none;
  }

  .cm-highlightSpace::before {
    content: "·";
    position: absolute;
    inset-inline-start: 50%;
    inset-block-start: 50%;
    transform: translate(-50%, -50%);
  }

  .cm-highlightTab::before {
    content: "→";
    position: absolute;
    inset-block-start: 50%;
    transform: translateY(-50%);
  }

  .cm-sbx-blank-line-selected:has(> br:only-child)::before {
    content: "␣";
    position: absolute;
    inset-inline-start: 0;
    opacity: var(--opacity-low);
  }
`;
