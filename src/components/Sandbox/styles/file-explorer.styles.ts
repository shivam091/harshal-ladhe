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
  background: var(--color-bg-muted);
`;

/*
  Labeled header row above the directory tree — block-size matches sp-tabs/PreviewPanel's TabBar
  (both 2.5rem) so all three columns' top rows line up. Real text in a real element, not
  a ::before/::after pseudo-element, so it's selectable and shows up to assistive tech.
*/
export const FileExplorerHeader = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  block-size: 2.5rem;
  padding-inline: 0.5rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);
  border-inline-end: 0.0625rem solid var(--color-border-muted);
  background: var(--color-bg-muted);
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
