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
  block-size: var(--size-xxl);
  flex-shrink: 0;
  padding-inline: var(--space-sm);
  border-block-end: var(--border-width-default) solid var(--color-border-muted);
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
  gap: var(--space-xxs);
`;

// A single "Output"/"Console" tab — underline slides in via the ::after accent bar on [data-active].
export const TabButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding-block: 0;
  padding-inline: var(--space-md);
  background: transparent;
  border: none;
  color: var(--color-fg-muted);
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: color var(--motion-duration-fast) ease;

  &::after {
    content: "";
    position: absolute;
    inset-inline: var(--space-sm);
    inset-block-end: 0;
    block-size: 2px;
    border-start-start-radius: var(--border-radius-xs);
    border-start-end-radius: var(--border-radius-xs);
    border-end-end-radius: 0;
    border-end-start-radius: 0;
    background: var(--color-fg-accent);
    opacity: 0;
    transition: opacity var(--motion-duration-fast) ease;
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
  margin-inline-start: var(--space-xxs);
  font-size: var(--font-size-xxs);

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
  min-inline-size: var(--space-base);
  block-size: var(--space-base);
  padding-inline: var(--space-xxs);
  margin-inline-start: var(--space-xxs);
  border-radius: var(--border-radius-pill);
  background: var(--color-bg-danger-emphasis);
  color: var(--color-fg-on-emphasis);
  font-family: var(--font-stack-system);
  font-size: var(--font-size-xs);
  line-height: 1;
`;
