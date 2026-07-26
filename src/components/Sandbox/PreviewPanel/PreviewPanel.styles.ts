import { styled } from "@linaria/react";

// Outer flex column — tab bar, content pane, and MetaBar stack top to bottom.
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

// Row holding the Output/Console tab buttons and the active tab's action icon (rerun/clear).
export const TabBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  block-size: 2.5rem;
  flex-shrink: 0;
  padding-inline: 0.5rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);
  background: var(--color-bg-muted);
`;

// Groups the Output/Console TabButtons together, separate from the action icon(s) on the other side of TabBar.
export const Tabs = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0;
  block-size: 100%;
`;

/*
  Groups the active tab's own action icon(s) — rerun (Output), clear console (Console), or the
  split-view/hide-whitespace pair (Diff) — into one unit on TabBar's end side, regardless of how
  many icons the active tab happens to have.
*/
export const TabActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.1875rem;
`;

// A single "Output"/"Console" tab — underline slides in via the ::after accent bar on [data-active].
export const TabButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0;
  padding-inline: 0.75rem;
  background: transparent;
  border: none;
  color: var(--color-fg-muted);
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  cursor: pointer;
  transition: color 150ms ease;

  &::after {
    content: "";
    position: absolute;
    inset-inline: 0.5rem;
    inset-block-end: 0;
    block-size: 2px;
    border-start-start-radius: 0.125rem;
    border-start-end-radius: 0.125rem;
    border-end-end-radius: 0;
    border-end-start-radius: 0;
    background: var(--color-fg-accent);
    opacity: 0;
    transition: opacity 150ms ease;
  }

  &[data-active="true"] {
    color: var(--color-fg-default);

    &::after {
      opacity: 1;
    }
  }

  &:hover {
    color: var(--color-fg-default);
  }
`;

// "+3 −1" next to the Diff tab's own label — only rendered while the active file actually differs from its original.
export const TabStat = styled.span`
  margin-inline-start: 0.1875rem;
  font-size: 0.6875rem;

  .added {
    color: var(--color-code-syntax-inserted-text);
  }

  .removed {
    color: var(--color-code-syntax-deleted-text);
    margin-inline-start: 2px;
  }
`;

// Fills the remaining height below TabBar; holds both Panes (only the active one is visible).
export const Content = styled.div`
  flex: 1;
  min-block-size: 0;
  overflow: hidden;
  position: relative;
  background: var(--color-bg-default);
`;

/*
  One tab's content area — output iframe or console log. Both stay mounted; the inactive one is
  just hidden, so switching tabs doesn't tear down state (iframe/scroll position).
*/
export const Pane = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  block-size: 100%;

  &[data-visible="false"] {
    display: none;
  }
`;

/*
  Matches Sandpack's own previewIframe class — sandbox/allow/src attributes are set
  programmatically by @codesandbox/sandpack-client once its bundler client attaches, not here.
*/
export const PreviewIframe = styled.iframe`
  border: 0;
  outline: 0;
  inline-size: 100%;
  block-size: 100%;
  min-block-size: 160px;
  max-block-size: 2000px;
  flex: 1;
`;

// Wraps the preview iframe, filling the pane.
export const ViewportFrame = styled.div`
  position: relative;
  flex: 1;
  min-block-size: 0;
  inline-size: 100%;
  overflow: hidden;
`;

// Error-count pill on the Console tab — only rendered while at least one logged entry is an error.
export const ErrorBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 1rem;
  block-size: 1rem;
  padding-inline: 0.1875rem;
  margin-inline-start: 0.1875rem;
  border-radius: 50rem;
  background: var(--color-bg-danger-emphasis);
  color: var(--color-fg-on-emphasis);
  font-family: 'Alan Sans', 'Source Sans 3', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', 'Noto Sans', 'Liberation Sans', Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  font-size: 0.75rem;
  line-height: 1;
`;
