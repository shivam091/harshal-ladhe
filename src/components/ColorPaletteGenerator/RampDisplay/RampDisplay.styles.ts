import { styled } from "@linaria/react";

export const ModeRow = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const ModeButton = styled.button`
  padding: 0.25rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 999px;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }
`;

export const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(3.75rem, 1fr));
  gap: 0.375rem;
`;

export const Swatch = styled.button`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  cursor: pointer;
  text-align: start;

  &:hover {
    border-color: var(--color-fg-accent);
  }
`;

export const SwatchColor = styled.span`
  display: block;
  block-size: 3rem;
`;

export const SwatchMeta = styled.span`
  display: flex;
  flex-direction: column;
  gap: 0.0625rem;
  padding: 0.25rem 0.375rem;
  background: var(--color-bg-default);
`;

export const SwatchName = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

export const SwatchHex = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.625rem;
  color: var(--color-fg-muted);
`;
