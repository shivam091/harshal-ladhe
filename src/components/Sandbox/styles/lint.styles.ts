import { opaqueBgCss } from "@/components/common.styles";

// Lint diagnostics (lint.ts): inline squiggles, the gutter markers that surface them, and the diagnostic panel/tooltip.
export const lintCss = `
  /* Native wavy text-decoration replaces lint's hardcoded-colour SVG background, which can't resolve CSS custom properties. */
  .cm-lintRange {
    background-image: none !important;
    text-decoration-line: underline;
    text-decoration-style: wavy;
    text-decoration-skip-ink: none;
  }

  .cm-lintRange-error {
    text-decoration-color: var(--color-fg-danger) !important;
  }

  .cm-lintRange-warning {
    text-decoration-color: var(--color-fg-attention) !important;
  }

  .cm-lintRange-info {
    text-decoration-color: var(--color-fg-neutral) !important;
  }

  .cm-lintRange-hint {
    text-decoration-color: var(--color-fg-muted) !important;
  }

  .cm-lintRange-active {
    background: var(--color-bg-accent-muted) !important;
  }

  /* Lint gutter column is reserved unconditionally by @codemirror/lint — collapsed here and restored only once diagnostics exist. */
  .cm-gutter-lint {
    display: none !important;
  }

  .cm-editor.cm-has-diagnostics .cm-gutter-lint {
    display: flex !important;
  }

  /* Unlike the fold gutter, @codemirror/lint never centres its own marker in a taller line — centred here instead. */
  .cm-gutter-lint .cm-gutterElement {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  /* Gutter dot markers — same data-uri var() limitation as the squiggle above, so a plain coloured circle replaces the built-in image. */
  .cm-lint-marker {
    content: none !important;
    border-radius: 50%;
    cursor: pointer;
  }

  .cm-lint-marker-error {
    background: var(--color-fg-danger) !important;
  }

  .cm-lint-marker-warning {
    background: var(--color-fg-attention) !important;
  }

  .cm-lint-marker-info {
    background: var(--color-fg-neutral) !important;
  }

  /* Box chrome comes from the shared tooltip rule, so only font and overflow are set here. */
  .cm-tooltip-lint {
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.875rem !important;
    overflow: hidden;
  }

  /* Mod-Shift-m lint panel is a genuinely different element (.cm-panel, not .cm-tooltip) — needs its own full chrome. */
  .cm-panel.cm-panel-lint {
    background: var(--color-bg-default) !important;
    border: 0.0625rem solid var(--color-border-muted) !important;
    border-radius: 0.375rem !important;
    font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    font-size: 0.875rem !important;
    overflow: hidden;
  }

  .cm-diagnostic {
    border-inline-start-width: 3px !important;
    color: var(--color-fg-default);
    margin-block-end: 0;
  }

  .cm-diagnostic-error {
    border-inline-start-color: var(--color-border-danger-emphasis) !important;
    background-image: ${opaqueBgCss("var(--color-bg-danger-muted)")};
    color: var(--color-fg-danger);
  }

  .cm-diagnostic-warning {
    border-inline-start-color: var(--color-border-attention-emphasis) !important;
    background-image: ${opaqueBgCss("var(--color-bg-attention-muted)")};
    color: var(--color-fg-attention);
  }

  .cm-diagnostic-info {
    border-inline-start-color: var(--color-border-accent-muted) !important;
    background-image: ${opaqueBgCss("var(--color-bg-accent-muted)")};
    color: var(--color-fg-accent);
  }

  .cm-diagnostic-hint {
    border-inline-start-color: var(--color-border-muted) !important;
  }

  .cm-diagnosticAction {
    background: var(--color-bg-accent-emphasis) !important;
    color: var(--color-fg-on-emphasis) !important;
    border-radius: 0.1875rem !important;
  }

  .cm-diagnosticSource {
    color: var(--color-fg-muted);
  }
`;
