import { styled } from "@linaria/react";

// Airmail-envelope stripes frame the form; layered backgrounds keep the stripes confined to the border.
export const FormBorder = styled.div`
  border: 0.5rem solid transparent;
  border-radius: 1rem;
  background:
    linear-gradient(var(--color-bg-muted), var(--color-bg-muted)) padding-box,
    repeating-linear-gradient(
      45deg,
      var(--color-bg-danger-emphasis) 0 15px,
      var(--color-bg-default) 15px 25px,
      var(--color-bg-accent-emphasis) 25px 40px,
      var(--color-bg-default) 40px 50px
    ) border-box;
  transition:
    --color-bg-muted 350ms cubic-bezier(0.41, 0.1, 0.13, 1),
    --color-bg-danger-emphasis 350ms cubic-bezier(0.41, 0.1, 0.13, 1),
    --color-bg-accent-emphasis 350ms cubic-bezier(0.41, 0.1, 0.13, 1),
    --color-bg-default 350ms cubic-bezier(0.41, 0.1, 0.13, 1);
`;

// Page-coloured fill separates the fields from the striped frame around them.
export const FormRoot = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--color-bg-default);
  padding: 0.75rem;
  border-radius: 0.75rem;
`;

// Label-above-input keeps fields readable at any container width.
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

// Required marker is generated from data-required so markup can't drift out of sync with the asterisk.
export const FormLabel = styled.label`
  position: relative;
  font-weight: 600;
  vertical-align: middle;
  margin-block-end: 0.5rem;
  color: var(--color-fg-default);

  &[data-required]::after {
    content: "*";
    color: var(--color-fg-danger);
    margin-inline-start: 0.25rem;
    font-weight: 700;
    position: relative;
    inset-block-start: -2px;
  }
`;

const sharedInputStyles = `
  appearance: none;
  inline-size: 100%;
  padding: 0.75rem 1rem;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-fg-default);
  background: transparent;
  border: 1px solid var(--color-border-default);
  border-radius: 0.375rem;
  outline: none;
  transition:
    border-color 150ms cubic-bezier(0.25, 0.1, 0.25, 1),
    box-shadow 150ms cubic-bezier(0.25, 0.1, 0.25, 1);

  &::placeholder {
    color: var(--color-fg-muted);
    font-style: italic;
    opacity: 0.6;
  }

  &:focus-visible {
    outline: none;
    border-color: var(--color-border-accent-emphasis);
    box-shadow: 0 0 0 0.25rem hsl(from var(--color-bg-accent-emphasis) h s l / 0.25);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Shares one reset with the textarea so every field looks and focuses the same.
export const FormControl = styled.input`${sharedInputStyles}`;

// Block-only resize lets long messages grow without breaking the form's width.
export const FormTextarea = styled.textarea`
  ${sharedInputStyles}
  resize: block;
  min-block-size: 150px;
  line-height: 1.75;
`;

// Groups the submit action so its spacing is independent of the field gap.
export const FormFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// Google's reCAPTCHA terms require this attribution; muted so it doesn't compete with the form.
export const RecaptchaDisclaimer = styled.p`
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  line-height: 1.625;
  margin-block-start: 0.5rem;
  opacity: 0.75;

  a {
    color: var(--color-fg-accent-muted);
    text-decoration-line: underline;
    text-underline-offset: 2px;
    transition: color 150ms ease;

    &:hover {
      color: var(--color-fg-accent);
    }
  }
`;
