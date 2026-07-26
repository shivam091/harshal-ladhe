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
    --sp-font-body: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji' !important;
    --sp-font-mono: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace !important;
    --sp-font-size: var(--sandbox-editor-font-size, 0.875rem) !important;
    --sp-font-lineHeight: 1.6 !important;

    /* Color for base/untagged editor text — plain text CodeMirror's syntax highlighting doesn't classify. */
    --sp-syntax-color-plain: var(--color-fg-default) !important;
  }
`;
