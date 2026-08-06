import { css } from "@linaria/core";
import { styled } from "@linaria/react";
import { sandpackThemeVarsCss } from "@/components/Sandbox/styles/sandpack-theme-vars.styles";
import { tabsExplorerCss } from "@/components/Sandbox/styles/tabs-explorer.styles";
import { editorBaseCss } from "@/components/Sandbox/styles/editor-base.styles";
import { guttersCss } from "@/components/Sandbox/styles/gutters.styles";
import { foldingCss } from "@/components/Sandbox/styles/folding.styles";
import { tooltipsAutocompleteCss } from "@/components/Sandbox/styles/tooltips-autocomplete.styles";
import { syntaxColorsCss } from "@/components/Sandbox/styles/syntax-colors.styles";
import { bracketsCss } from "@/components/Sandbox/styles/brackets.styles";
import { bracketMatchCss } from "@/components/Sandbox/styles/bracket-match.styles";
import { tagMatchCss } from "@/components/Sandbox/styles/tag-match.styles";
import { breadcrumbBarCss } from "@/components/Sandbox/styles/breadcrumb-bar.styles";
import { stickyScrollCss } from "@/components/Sandbox/styles/sticky-scroll.styles";
import { whitespaceCss } from "@/components/Sandbox/styles/whitespace.styles";
import { searchPanelCss } from "@/components/Sandbox/styles/search-panel.styles";
import { gotoLineCss } from "@/components/Sandbox/styles/goto-line.styles";
import { lintCss } from "@/components/Sandbox/styles/lint.styles";
import { consoleOverlayCss } from "@/components/Sandbox/styles/console-overlay.styles";
import { fullscreenCss } from "@/components/Sandbox/styles/fullscreen.styles";
import { diffGutterCss } from "@/components/Sandbox/styles/diff-gutter.styles";
import { minimapCss } from "@/components/Sandbox/styles/minimap.styles";

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
  border-radius: 0.375rem;
  background: transparent;
  color: var(--color-fg-muted);
  cursor: pointer;
  text-decoration: none;
  transition: color 150ms ease, background 150ms ease;

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

// Row holding just the sandbox's title/description — SandboxToolbar sits in its own row below.
export const SandboxHeader = styled.div`
  padding-block: 0.25rem;
  padding-inline: 0.5rem;
  background: var(--color-bg-muted);
`;

// Groups SandboxTitle + SandboxDescription so they sit together on SandboxHeader's start side.
export const SandboxHeaderMeta = styled.div``;

/*
  Sits below SandboxHeader and above the file-explorer/editor tabs and preview tabs — holds
  SandboxToolbar, right-aligned, with the border that used to close off SandboxHeader now
  closing off this row instead (it's the last piece of "chrome" before the actual sandbox body).
*/
export const SandboxToolbarRow = styled.div`
  border-block: 0.0625rem solid var(--color-border-muted);
  background: var(--color-bg-muted);
`;

// The sandbox's display name, from its SandboxMeta.
export const SandboxTitle = styled.p`
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.25;
  color: var(--color-fg-default);
  letter-spacing: -0.01em;
`;

// One-line summary shown under SandboxTitle.
export const SandboxDescription = styled.p`
  margin-block-start: 0.125rem;
  font-size: 0.875rem;
  line-height: 1.375;
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
  /* Anchors ReadOnlyBadgeWrapper's absolute positioning below. */
  position: relative;
`;

/*
  Floating "Read-only" badge pinned to the editor's bottom-right corner, sitting just above
  EditorMetaBar rather than overlapping it, and never intercepting clicks/scroll meant for the
  code underneath.
*/
export const ReadOnlyBadgeWrapper = styled.div`
  position: absolute;
  inset-inline-end: 1rem;
  inset-block-end: 2.5rem;
  z-index: 5;
  pointer-events: none;
`;

/*
  Bottom-edge drag handle that resizes the whole sandbox container (see useResizableHeight) —
  a thin muted seam that highlights on hover/focus, same formula as toolbarIconButtonCx's own
  hover background and the app's shared focus-visible outline tokens.
*/
export const ResizeHandle = styled.button`
  position: relative;
  z-index: 301;
  display: block;
  inline-size: 100%;
  block-size: 10px;
  padding: 0;
  background: transparent;
  border: none;
  border-block-start: 0.0625rem solid var(--color-border-muted);
  flex-shrink: 0;
  cursor: row-resize;
  /* Without this, touch browsers treat a drag as page-pan and scroll instead of resizing. */
  touch-action: none;
  transition: background-color 150ms ease;

  &:hover {
    background-color: var(--color-bg-neutral-muted);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-outline-focus);
    outline-offset: calc(-1 * 0.125rem);
  }
`;

/*
  Stacked (mobile) layout: explorer row on top, split pane fills the rest. Always rendered and
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
  border-radius: 0.375rem;
  overflow: clip;
  border: 0.0625rem solid var(--color-border-muted);
  margin-block: clamp(0.75rem, 1vw, 1rem);

  ${sandpackThemeVarsCss}
  ${tabsExplorerCss}
  ${editorBaseCss}
  ${guttersCss}
  ${foldingCss}
  ${tooltipsAutocompleteCss}
  ${syntaxColorsCss}
  ${bracketsCss}
  ${bracketMatchCss}
  ${tagMatchCss}
  ${breadcrumbBarCss}
  ${stickyScrollCss}
  ${whitespaceCss}
  ${searchPanelCss}
  ${gotoLineCss}
  ${lintCss}
  ${consoleOverlayCss}
  ${fullscreenCss}
  ${diffGutterCss}
  ${minimapCss}
`;
