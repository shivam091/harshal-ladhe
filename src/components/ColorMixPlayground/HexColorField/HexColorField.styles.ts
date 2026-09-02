import { styled } from "@linaria/react";

export const HexRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.375rem;
`;

export const SwatchInput = styled.input`
  flex: 0 0 auto;
  inline-size: 2.25rem;
  block-size: 2.25rem;
  padding: 0;
  appearance: none;
  background: transparent;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0.125rem;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 0.125rem;
  }
`;

export const HexTextInput = styled.input`
  flex: 1 1 auto;
  min-inline-size: 0;
  padding: 0.375rem 0.5rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  text-transform: lowercase;
`;
