import { opaqueBgCss } from "@/components/common.styles";

// Diff gutter (diff-gutter.ts): per-line added/removed markers, the gutter column itself, and the click-to-open diff popup.
export const diffGutterCss = `
  /*
    Collapsed until the active file actually differs from its original content — same collapse-when-empty
    treatment as the lint gutter.
  */
  .cm-sbx-diff-gutter {
    display: none !important;
  }

  .cm-editor.cm-has-diff .cm-sbx-diff-gutter {
    display: flex !important;
  }

  .cm-sbx-diff-gutter .cm-gutterElement {
    padding: 0 !important;
  }

  .cm-sbx-diff-spacer,
  .cm-sbx-diff-marker {
    inline-size: 3px;
    block-size: 100%;
  }

  .cm-sbx-diff-marker {
    border-radius: 2px;
    cursor: pointer;
  }

  .cm-sbx-diff-marker-added {
    background: var(--color-code-syntax-inserted-text);
  }

  .cm-sbx-diff-marker-removed {
    background: var(--color-code-syntax-deleted-text);
  }

  /*
    Box chrome comes from the shared tooltip rule, so only font and layout are set here.
  */
  .cm-tooltip-diff {
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.875rem !important;
    line-height: 1.6 !important;
    overflow: hidden;
    max-inline-size: 32rem;
  }

  /*
    Unified-diff header line ("@@ -5,10 +5,12 @@") — visually distinct from the +/- rows below it, muted rather
    than red/green since it isn't itself a changed line.
  */
  .cm-sbx-diff-hunk-header {
    padding-inline: 0.5rem;
    padding-block-end: 0.1875rem;
    color: var(--color-fg-muted);
    white-space: pre;
  }

  /*
    Same treatment as lint diagnostics, so both gutters' popups read alike.
  */
  .cm-sbx-diff-line {
    display: flex;
    gap: 0.1875rem;
    padding-inline: 0.5rem;
    border-inline-start-width: 3px !important;
    min-block-size: 1lh;
    white-space: pre;
  }

  .cm-sbx-diff-line-marker {
    flex-shrink: 0;
    inline-size: 1ch;
    font-weight: 700;
  }

  .cm-sbx-diff-line-removed {
    border-inline-start-color: var(--color-code-syntax-deleted-text) !important;
    background-image: ${opaqueBgCss("var(--color-code-syntax-deleted-bg)")};
    color: var(--color-code-syntax-deleted-text);
  }

  .cm-sbx-diff-line-added {
    border-inline-start-color: var(--color-code-syntax-inserted-text) !important;
    background-image: ${opaqueBgCss("var(--color-code-syntax-inserted-bg)")};
    color: var(--color-code-syntax-inserted-text);
  }

  /*
    Highlights just the words that changed within a replaced-line pair, on top of the row's own
    add/remove tint.
  */
  .cm-sbx-diff-line-removed [data-changed="true"],
  .cm-sbx-diff-line-added [data-changed="true"] {
    color: var(--color-code-syntax-changed-text) !important;
  }
`;
