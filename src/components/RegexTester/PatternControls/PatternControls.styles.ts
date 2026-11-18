import { styled } from "@linaria/react";

// Vertical label+control stack shared by both fields in this panel — this tool's own copy rather than reusing another feature's field wrapper, since RegexTester doesn't otherwise depend on it.
export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

// Small-caps label above a field in FieldWrapper.
export const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

// The pattern's slash-delimited "headline" row — reads like a marked-up manuscript title rather than a plain text input.
export const Delimited = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0.25rem;
  padding: 0.25rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.5rem;

  &:focus-within {
    border-color: var(--color-fg-attention);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-attention) 22%, transparent);
  }
`;

// The literal "/" delimiters bracketing the pattern input, styled like a JS regex literal.
export const Slash = styled.span`
  display: flex;
  align-items: center;
  padding-inline: 0.25rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-fg-attention);
`;

// The bare pattern text field sitting between the two Slash delimiters.
export const PatternInput = styled.input`
  flex: 1 1 auto;
  min-inline-size: 0;
  padding: 0.375rem 0.25rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--color-fg-default);
  background: transparent;
  border: none;
  outline: none;

  &[data-invalid="true"] {
    color: var(--color-fg-danger);
  }
`;

// A row of small "pin" tags — each toggled flag reads like a colored pin stuck through the corner of an index card rather than a plain checkbox.
export const FlagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4375rem;
`;

// One toggleable flag pin inside FlagRow.
export const FlagChip = styled.button`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.3125rem 0.625rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 624.9375rem;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover {
    border-color: color-mix(in srgb, var(--color-fg-attention) 55%, var(--color-border-default));
  }

  &[data-active="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-fg-attention);
    border-color: var(--color-fg-attention);
  }
`;

// The flag's single letter, e.g. "g", bolded within its chip.
export const FlagLetter = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-weight: 700;
`;

// The flag's full name, e.g. "Global", in small type beneath its letter.
export const FlagName = styled.span`
  font-size: 0.6875rem;
`;

// Inline validation banner for a pattern the RegExp constructor itself rejected — styled like a torn correction note pinned under the pattern field.
export const ErrorText = styled.p`
  margin: 0;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  color: var(--color-fg-danger);
  background: var(--color-bg-danger-muted);
  border: 0.0625rem dashed var(--color-border-danger-emphasis);
  border-radius: 0.375rem;
`;
