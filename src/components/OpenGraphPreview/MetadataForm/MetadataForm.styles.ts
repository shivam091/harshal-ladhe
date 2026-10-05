import { styled } from "@linaria/react";

// Typed values sit on the index card's own ruled line — no box, just an underline — so the form reads as handwriting on a card rather than a stack of web inputs.
export const CardInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.25rem 0.125rem;
  font: inherit;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: transparent;
  border: none;
  border-block-end: 0.0625rem dashed color-mix(in srgb, var(--color-fg-muted) 55%, transparent);
  border-radius: 0;

  &::placeholder {
    color: color-mix(in srgb, var(--color-fg-muted) 70%, transparent);
  }

  &:focus-visible {
    outline: none;
    border-block-end: 0.125rem solid var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 6%, transparent);
  }
`;

// The description gets a resizable multi-line version of the same underlined treatment.
export const CardTextarea = styled.textarea`
  inline-size: 100%;
  min-block-size: 4.5rem;
  padding: 0.25rem 0.125rem;
  font: inherit;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: var(--color-fg-default);
  background: transparent;
  border: none;
  border-block-end: 0.0625rem dashed color-mix(in srgb, var(--color-fg-muted) 55%, transparent);
  border-radius: 0;
  resize: vertical;

  &:focus-visible {
    outline: none;
    border-block-end: 0.125rem solid var(--color-fg-accent);
    background: color-mix(in srgb, var(--color-fg-accent) 6%, transparent);
  }
`;

// Label on the left, live character count on the right — the count is the number people actually tune titles and descriptions against.
export const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
`;

// Turns amber once a length passes its platform limit, matching the audit's own warn colour.
export const CharCount = styled.span`
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.6875rem;
  color: var(--color-fg-muted);

  &[data-over="true"] {
    color: var(--color-fg-attention);
    font-weight: 700;
  }
`;

// Pairs of short fields share a row on wider cards and stack on a phone.
export const FieldPair = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: 0.75rem;
`;

// Hex text field and native swatch side by side, so a colour can be typed exactly or picked by eye.
export const ColourRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  & > input[type="color"] {
    flex: 0 0 2.25rem;
    inline-size: 2.25rem;
  }
`;

// The upload control and its status line — sits under the image URL field because it's an alternative to it, not a separate setting.
export const UploadRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

// A visually-plain native file input kept fully focusable — restyling only the button part via ::file-selector-button keeps keyboard and screen-reader behaviour intact.
export const FileInput = styled.input`
  max-inline-size: 100%;
  font-size: 0.75rem;
  color: var(--color-fg-muted);

  &::file-selector-button {
    margin-inline-end: 0.5rem;
    padding: 0.25rem 0.5rem;
    font: inherit;
    font-weight: 600;
    color: var(--color-fg-default);
    background: color-mix(in srgb, var(--color-fg-attention) 10%, var(--color-bg-default));
    border: 0.0625rem solid var(--color-border-default);
    border-radius: 0.25rem;
    cursor: pointer;
  }
`;

// A text-style button for clearing the upload — low emphasis, since it's a secondary action.
export const ClearButton = styled.button`
  padding: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-danger);
  background: none;
  border: none;
  text-decoration: underline;
  cursor: pointer;
`;
