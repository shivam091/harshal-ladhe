import { styled } from "@linaria/react";

/*
  Wraps SandpackFileExplorer with its own header row above the directory tree, so the file
  explorer column gets the same three-row shape (header, then content) as the editor and preview
  columns beside it.
*/
export const FileExplorerColumn = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/*
  Labeled header row above the directory tree — block-size matches sp-tabs/PreviewPanel's TabBar
  (both var(--size-xxl)) so all three columns' top rows line up. Real text in a real element, not
  a ::before/::after pseudo-element, so it's selectable and shows up to assistive tech.
*/
export const FileExplorerHeader = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  block-size: var(--size-xxl);
  padding-inline: var(--space-sm);
  border-block-end: var(--border-width-default) solid var(--color-border-muted);
  border-inline-end: var(--border-width-default) solid var(--color-border-muted);
  background: var(--color-bg-muted);
  font-size: var(--font-size-xs);
  color: var(--color-fg-muted);
`;
