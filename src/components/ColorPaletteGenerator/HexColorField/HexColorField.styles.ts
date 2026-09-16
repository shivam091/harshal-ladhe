import { styled } from "@linaria/react";

// Pairs the native color swatch with its typed hex code, side by side like an ink dab next to its printed formula code.
export const ChipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Native color-picker swatch, squared off with a thin ruled border rather than a soft rounded pill — reads as a small ink sample chip.
export const ChipSwatch = styled.input`
  inline-size: 2.25rem;
  block-size: 2.25rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  background: transparent;
  cursor: pointer;
  flex: 0 0 auto;

  &::-webkit-color-swatch-wrapper {
    padding: 0.1875rem;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 0.125rem;
  }
`;

// Typed hex code, set in monospace like a printed Pantone-style formula reference rather than a plain text input.
export const HexInput = styled.input`
  flex: 1 1 auto;
  min-inline-size: 0;
  padding: 0.5rem 0.625rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.8125rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-fg-default);
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.25rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus-visible {
    outline: none;
    border-color: var(--color-fg-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-accent) 22%, transparent);
  }
`;
