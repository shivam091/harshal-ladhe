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

// Groups the Output/Console TabButtons together, separate from the action icon on the other side of TabBar.
export const Tabs = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0;
  block-size: 100%;
`;

// A single "Output"/"Console" tab — underline slides in via the ::after accent bar on [data-active].
export const TabButton = styled.button`
  position: relative;
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
