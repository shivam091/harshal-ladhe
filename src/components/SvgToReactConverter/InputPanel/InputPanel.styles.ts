import { styled } from "@linaria/react";

const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// The drop target — a dashed copper keep-out outline that turns solid while a file hovers over it, so the drop affordance is obvious.
export const DropZone = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 0.125rem dashed color-mix(in srgb, var(--pcb-copper) 50%, var(--color-border-default));
  border-radius: 0.375rem;
  transition: border-color 150ms ease, background-color 150ms ease;

  &[data-dragging="true"] {
    border-style: solid;
    border-color: var(--pcb-copper);
    background-color: color-mix(in srgb, var(--pcb-copper) 8%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// Instructions beside the upload button — also the textarea's description, so screen readers hear that dropping works too.
export const DropHint = styled.span`
  flex: 1 1 10rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

/*
  A <label> styled as a gold pin, wrapping the real (visually hidden) file input — clicking or
  pressing Enter/Space on the focused input opens the picker natively, with no JS click relay.
*/
export const UploadPin = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  block-size: 2rem;
  padding: 0 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  color: color-mix(in srgb, black 80%, var(--pcb-gold));
  background: linear-gradient(145deg, color-mix(in srgb, var(--pcb-gold) 85%, white), var(--pcb-gold) 55%, color-mix(in srgb, var(--pcb-gold) 75%, black));
  border: 0.0625rem solid color-mix(in srgb, var(--pcb-gold) 60%, black);
  border-radius: 0.1875rem;
  cursor: pointer;

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-within {
    outline: 0.125rem solid var(--color-outline-focus, var(--color-fg-accent));
    outline-offset: 0.125rem;
  }
`;

// Visually hidden but still focusable and operable — display:none would drop it from the tab order entirely.
export const HiddenFileInput = styled.input`
  position: absolute;
  inline-size: 0.0625rem;
  block-size: 0.0625rem;
  padding: 0;
  margin: -0.0625rem;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;

// Monospace like the output, since what's typed here becomes an identifier in the generated code.
export const NameInput = styled.input`
  inline-size: 100%;
  padding: 0.375rem 0.5rem;
  font-family: ${MONO_FONT};
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
`;

// Source editor — monospace, no wrapping, since SVG path data is unreadable once soft-wrapped mid-coordinate.
export const SourceTextarea = styled.textarea`
  flex: 1 1 100%;
  inline-size: 100%;
  min-block-size: 14rem;
  padding: 0.625rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: pre;
  color: var(--color-fg-default);
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  resize: vertical;

  &[data-invalid="true"] {
    border-color: var(--color-border-danger-emphasis);
  }
`;

// Always rendered (empty, so zero-height, when there's no error) so its live region exists before the first message arrives — hiding it with display:none would stop it announcing.
export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-danger);
`;
