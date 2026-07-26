/*
  Sandpack reads these --sp-* custom properties throughout its own internals (editor/gutter
  backgrounds, fonts) — rebinding them to this app's tokens covers those internals now that the
  JS theme prop is gone (see SandboxClient.tsx), which otherwise default to Sandpack's own baked-in
  light palette.
*/
export const sandpackThemeVarsCss = `
  .sp-wrapper {
    --sp-colors-surface1: var(--color-bg-muted) !important;
    --sp-colors-surface2: var(--color-border-muted) !important;
    --sp-colors-surface3: var(--color-bg-neutral-muted) !important;
    --sp-colors-clickable: var(--color-fg-muted) !important;
    --sp-colors-base: var(--color-fg-default) !important;
    --sp-colors-disabled: var(--color-fg-disabled) !important;
    --sp-colors-hover: var(--color-fg-default) !important;
    --sp-colors-accent: var(--color-fg-accent) !important;
    --sp-colors-error: var(--color-fg-danger) !important;
    --sp-colors-errorSurface: var(--color-bg-danger-muted) !important;
    --sp-font-body: var(--font-stack-system) !important;
    --sp-font-mono: var(--font-stack-monospace) !important;
    --sp-font-size: var(--sandbox-editor-font-size, var(--font-size-sm)) !important;
    --sp-font-lineHeight: var(--line-height-code) !important;

    /* Color for base/untagged editor text — plain text CodeMirror's syntax highlighting doesn't classify. */
    --sp-syntax-color-plain: var(--color-fg-default) !important;
  }
`;
