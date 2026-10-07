import { styled } from "@linaria/react";

// Monospace for the markup and the file name, since both are code rather than prose.
const MONO_FONT = "'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";

// The intake hatch — a dashed twine outline that turns solid kraft while a file hovers over it, so the drop affordance is obvious.
export const DropZone = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 0.125rem dashed color-mix(in srgb, var(--po-twine) 60%, var(--color-border-default));
  border-radius: 0.25rem;
  transition: border-color 150ms ease, background-color 150ms ease;

  &[data-dragging="true"] {
    border-style: solid;
    border-color: var(--po-brass);
    background-color: color-mix(in srgb, var(--po-kraft) 35%, transparent);
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
  A <label> styled as a brass button, wrapping the real (visually hidden) file input — clicking or
  pressing Enter/Space on the focused input opens the picker natively, with no JS click relay.
*/
export const UploadButton = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  block-size: 2rem;
  padding: 0 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: color-mix(in srgb, black 82%, var(--po-brass));
  background: linear-gradient(160deg, var(--po-brass-light), var(--po-brass) 50%, var(--po-brass-dark));
  border: 0.0625rem solid var(--po-brass-dark);
  border-radius: 999px;
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

// The parcel's address label — which file is on the counter, and the name the download will take.
export const FileTag = styled.p`
  margin: 0;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  color: var(--color-fg-muted);

  & > strong {
    color: var(--color-fg-default);
  }
`;

// Source editor — monospace and unwrapped, since path data is unreadable once soft-wrapped mid-coordinate.
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
    border-color: var(--color-border-danger-emphasis, var(--color-fg-danger));
  }
`;

// Always rendered (empty when there's no error) so its live region exists before the first message arrives.
export const ErrorText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-fg-danger);
`;
