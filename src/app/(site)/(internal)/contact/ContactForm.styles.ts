import { styled } from "@linaria/react";

// Decorative diagonal-stripe border wrapper — clips the background gradient to padding-box.
export const FormBorder = styled.div`
  border: var(--border-width-extra-thick) solid transparent;
  border-radius: var(--border-radius-xl);
  background:
    linear-gradient(var(--color-bg-muted), var(--color-bg-muted)) padding-box,
    repeating-linear-gradient(
      45deg,
      var(--color-bg-danger-emphasis) 0 15px,
      var(--color-bg-default) 15px 25px,
      var(--color-bg-accent-emphasis) 25px 40px,
      var(--color-bg-default) 40px 50px
    ) border-box;
`;

// Inner form shell — vertical flex column with page-background fill inside the border.
export const FormRoot = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  background: var(--color-bg-default);
  padding: var(--space-md);
  border-radius: var(--border-radius-lg);
`;

// Single form field group — stacks label above the input.
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

// Field label — semi-bold; appends a red asterisk for required fields via ::after.
export const FormLabel = styled.label`
  position: relative;
  font-weight: var(--font-weight-semi-bold);
  vertical-align: middle;
  margin-block-end: var(--space-sm);
  color: var(--color-fg-default);

  &[data-required]::after {
    content: "*";
    color: var(--color-fg-danger);
    margin-inline-start: var(--space-xs);
    font-weight: var(--font-weight-bold);
    position: relative;
    inset-block-start: -2px;
  }
`;

const sharedInputStyles = `
  appearance: none;
  inline-size: 100%;
  padding: var(--space-md) var(--space-base);
  font-family: inherit;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-base);
  color: var(--color-fg-default);
  background: transparent;
  border: 1px solid var(--color-border-default);
  border-radius: var(--border-radius-default);
  outline: none;
  transition:
    border-color var(--motion-duration-fast) var(--motion-easing-ease),
    box-shadow var(--motion-duration-fast) var(--motion-easing-ease);

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

// Single-line text input — inherits shared input reset and focus-ring styles.
export const FormControl = styled.input`${sharedInputStyles}`;

// Multi-line textarea — extends shared input styles with block-axis resize and min-height.
export const FormTextarea = styled.textarea`
  ${sharedInputStyles}
  resize: block;
  min-block-size: 150px;
  line-height: var(--line-height-paragraph);
`;

// Bottom row — stacks the submit button and disclaimer text vertically.
export const FormFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

// reCAPTCHA branding disclaimer — muted xs text with accent-coloured links.
export const RecaptchaDisclaimer = styled.p`
  font-size: var(--font-size-xs);
  color: var(--color-fg-muted);
  line-height: var(--line-height-relaxed);
  margin-block-start: var(--space-sm);
  opacity: 0.75;

  a {
    color: var(--color-fg-accent-muted);
    text-decoration-line: underline;
    text-underline-offset: 2px;
    transition: color var(--motion-duration-fast) ease;

    &:hover {
      color: var(--color-fg-accent);
    }
  }
`;
