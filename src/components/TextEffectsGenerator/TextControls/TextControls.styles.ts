import { styled } from "@linaria/react";

// The subject-text field, styled as a manuscript's own underlined blank rather than a boxed input — a single rule beneath the text is the theme's recurring "fill in the line" motif.
export const TextInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.125rem;
  font-family: inherit;
  font-size: 0.9375rem;
  color: var(--color-fg-default);
  background: transparent;
  border: none;
  border-block-end: 0.0625rem solid var(--color-border-default);
  border-radius: 0;

  &:focus {
    outline: none;
    border-block-end-color: var(--color-fg-default);
    border-block-end-width: 0.125rem;
    padding-block-end: calc(0.375rem - 0.0625rem);
  }
`;

// Small italic caption explaining why the text-color field currently has no visible effect — set in the same serif accent as MastheadTitle, reading as a production note scribbled in a margin.
export const HelperText = styled.p`
  margin: 0;
  font-family: Georgia, "Times New Roman", Times, serif;
  font-style: italic;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;
