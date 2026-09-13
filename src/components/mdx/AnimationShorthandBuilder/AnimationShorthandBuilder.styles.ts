import { styled } from "@linaria/react";
import { Wrapper } from "@/components/mdx/common.styles";

export { Wrapper };

// Horizontal row of shorthand-token cards; wraps onto multiple lines on narrow viewports instead of overflowing.
export const TokenRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.625rem;
  max-inline-size: 30rem;
`;

// One positional token: its example value on top, the longhand property name it maps to underneath.
export const TokenCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding-block: 0.5rem;
  padding-inline: 0.625rem;
  min-inline-size: 4.5rem;
  background: var(--color-bg-neutral-muted);
  border: 0.0625rem solid var(--color-border-neutral-muted);
  border-radius: 0.5rem;
`;

// The literal shorthand value (e.g. "1s", "ease-out"), styled as inline code.
export const TokenValue = styled.code`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-fg-default);
  white-space: nowrap;
`;

// The longhand property name this token maps to, e.g. "animation-duration".
export const TokenLabel = styled.span`
  font-size: 0.68rem;
  color: var(--color-fg-muted);
  text-align: center;
  white-space: nowrap;
`;
