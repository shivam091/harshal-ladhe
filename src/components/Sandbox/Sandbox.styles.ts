import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { sandpackThemeVarsCss } from "@/components/Sandbox/styles/sandpack-theme-vars.styles";
import { tabsExplorerCss } from "@/components/Sandbox/styles/tabs-explorer.styles";
import { fileIconsCss } from "@/components/Sandbox/styles/file-icons.styles";
import { editorBaseCss } from "@/components/Sandbox/styles/editor-base.styles";
import { guttersCss } from "@/components/Sandbox/styles/gutters.styles";
import { foldingCss } from "@/components/Sandbox/styles/folding.styles";
import { tooltipsAutocompleteCss } from "@/components/Sandbox/styles/tooltips-autocomplete.styles";
import { syntaxColorsCss } from "@/components/Sandbox/styles/syntax-colors.styles";
import { bracketsCss } from "@/components/Sandbox/styles/brackets.styles";
import { breadcrumbBarCss } from "@/components/Sandbox/styles/breadcrumb-bar.styles";
import { stickyScrollCss } from "@/components/Sandbox/styles/sticky-scroll.styles";
import { whitespaceCss } from "@/components/Sandbox/styles/whitespace.styles";
import { searchPanelCss } from "@/components/Sandbox/styles/search-panel.styles";
import { lintCss } from "@/components/Sandbox/styles/lint.styles";
import { consoleOverlayCss } from "@/components/Sandbox/styles/console-overlay.styles";

/*
  Shared icon-button look for toolbar/tab actions — a css class (not styled component) since it
  applies to several different element types.
*/
export const toolbarIconButtonCx = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  border: none;
  border-radius: var(--border-radius-md);
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  text-decoration: none;
  transition: color var(--motion-duration-fast) ease, background var(--motion-duration-fast) ease;

  &:hover {
    color: var(--color-fg-default);
    background: var(--color-bg-neutral-muted);
  }

  &[aria-pressed="true"] {
    color: var(--color-fg-accent);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:disabled:hover {
    background: transparent;
  }
`;

// Row holding the sandbox's title/description on one side and the Toolbar on the other.
export const SandboxHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-block: var(--space-xs);
  padding-inline: var(--space-sm);
  border-block-end: var(--border-width-default) solid var(--color-border-muted);
  background: var(--color-bg-muted);
`;

// Groups SandboxTitle + SandboxDescription so they sit together on SandboxHeader's start side.
export const SandboxHeaderMeta = styled.div``;

// The sandbox's display name, from its SandboxMeta.
export const SandboxTitle = styled.p`
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  color: var(--color-fg-default);
  letter-spacing: -0.01em;
`;

// One-line summary shown under SandboxTitle.
export const SandboxDescription = styled.p`
  margin-block-start: var(--space-xxxs);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-snug);
  color: var(--color-fg-muted);
`;

/*
  Wraps the editor with its own metadata bar so both stack and share the editor column's width without
  cross-column sync.
*/
export const SandboxColumn = styled.div`
  display: flex;
  flex-direction: column;
  block-size: 100%;
  overflow: hidden;
`;

/*
  Stacked (mobile) layout: explorer row on top, split pane fills the rest via 1fr. Always rendered and
  toggled via CSS (not swapped elements) to avoid a remount-loop when isVertical flips.
*/
export const StackedLayout = styled.div`
  block-size: 100%;
  inline-size: 100%;
  overflow: hidden;

  &[data-stacked="false"] {
    display: contents;
  }

  &[data-stacked="true"] {
    display: grid;
    grid-template-rows: auto 1fr;
  }
`;

/*
  Outermost sandbox frame — also scopes every Sandpack-internal (sp-/cm- classes) override below, since
  that DOM isn't ours to restyle globally. The overrides themselves live in ./styles, split by concern
  (mirrors the Editor/extensions split), and are composed here into this single styled-component.
*/
export const SandboxWrapper = styled.div`
  position: relative;
  border-radius: var(--border-radius-8);
  overflow: clip;
  border: var(--border-width-default) solid var(--color-border-muted);
  margin-block: var(--fluid-space-md);

  ${sandpackThemeVarsCss}
  ${tabsExplorerCss}
  ${fileIconsCss}
  ${editorBaseCss}
  ${guttersCss}
  ${foldingCss}
  ${tooltipsAutocompleteCss}
  ${syntaxColorsCss}
  ${bracketsCss}
  ${breadcrumbBarCss}
  ${stickyScrollCss}
  ${whitespaceCss}
  ${searchPanelCss}
  ${lintCss}
  ${consoleOverlayCss}
`;
