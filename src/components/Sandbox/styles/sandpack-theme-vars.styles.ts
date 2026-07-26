/*
  Sandpack reads these --sp-* custom properties straight off .sp-wrapper in its own internals
  (e.g. CodeMirror's editor/gutter background, "$colors$*"/"$font$*" stitches tokens) — rebinding
  them to this app's tokens here covers those internals directly, since removing the JS theme prop
  (see SandboxClient.tsx) left them defaulting to Sandpack's own baked-in light palette otherwise.
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
    --sp-font-body: var(--font-stack-system, sans-serif) !important;
    --sp-font-mono: var(--font-stack-monospace, monospace) !important;
    --sp-font-size: var(--font-size-sm) !important;
    --sp-font-lineHeight: var(--line-height-code) !important;

    /*
      Base/untagged editor text (plain HTML text nodes, attribute values, anything CodeMirror's
      lezer grammar leaves untagged) renders through Sandpack's own --sp-syntax-color-plain rather
      than any of the cm-sbx-* classes below — left unset it's stuck on Sandpack's built-in light
      value and goes unreadable against a dark surface1.
    */
    --sp-syntax-color-plain: var(--color-fg-default) !important;
  }
`;
