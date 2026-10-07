import { styled } from "@linaria/react";
import { DESK_FONT, FIGURE_FONT } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";

// The drop target — a blotter-paper well that darkens like soaked-up ink while a file hovers over it.
export const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  background: var(--ld-blotter);
  border: 0.125rem dashed color-mix(in srgb, var(--ld-brass) 50%, var(--color-border-default));
  border-radius: 0.375rem;
  transition: border-color 150ms ease, background-color 150ms ease;

  &[data-dragging="true"] {
    border-style: solid;
    border-color: var(--ld-ink);
    background-color: color-mix(in srgb, var(--ld-ink) 10%, var(--ld-blotter));
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// The markup itself, in monospace on a faintly ruled sheet.
export const SourceTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 9rem;
  padding: 0.5rem 0.625rem;
  font-family: ${FIGURE_FONT};
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  resize: vertical;

  &[data-invalid="true"] {
    border-color: var(--color-fg-danger);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.0625rem;
  }
`;

// The row under the textarea: the drop instructions and the upload fitting.
export const DropRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
`;

// Instructions beside the upload button — also the textarea's description, so screen readers hear that dropping works too.
export const DropHint = styled.span`
  flex: 1 1 10rem;
  font-family: ${DESK_FONT};
  font-size: 0.75rem;
  font-style: italic;
  color: var(--color-fg-muted);
`;

/*
  A <label> dressed as a brass fitting around the real (visually hidden) file input, so the picker
  opens natively by click or keyboard with no JS click relay.
*/
export const UploadFitting = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  min-block-size: 2rem;
  padding: 0 0.75rem;
  font-family: ${DESK_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--ld-brass) 20%, black);
  background: linear-gradient(to bottom, var(--ld-brass-light), var(--ld-brass) 60%, var(--ld-brass-dark));
  border: 0.0625rem solid var(--ld-brass-dark);
  border-radius: 999px;
  cursor: pointer;

  &:hover {
    filter: brightness(1.08);
  }

  &:focus-within {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;

// Visually hidden but still focusable and operable, unlike display: none.
export const HiddenFileInput = styled.input`
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

// Parse errors and sanitiser notes, in the danger and muted tones respectively.
export const StatusText = styled.p`
  margin: 0;
  min-block-size: 1.25rem;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);

  &[data-tone="error"] {
    color: var(--color-fg-danger);
  }
`;
