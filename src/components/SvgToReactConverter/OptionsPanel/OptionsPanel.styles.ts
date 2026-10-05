import { styled } from "@linaria/react";

// A real fieldset so each radio group and toggle list is announced under its own legend.
export const OptionGroup = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-inline-size: 0;
  margin: 0;
  padding: 0;
  border: 0;
`;

// Matches FieldLabel's size and weight so legends and labels read as one typographic level.
export const OptionLegend = styled.legend`
  margin-block-end: 0.375rem;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-default);
`;

// Checkboxes stack one per line — their labels are too long to sit side by side in the narrow input column.
export const ToggleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

// Wraps on narrow screens rather than squeezing three labels into one unreadable row.
export const SegmentRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
`;

/*
  A radio option painted as a segment button: the label carries the look, and :has() reads the
  hidden input's checked/focus state, so keyboard focus still shows a visible ring.
*/
export const SegmentOption = styled.label`
  flex: 1 1 auto;
  position: relative;
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: var(--color-fg-muted);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.25rem;
  cursor: pointer;

  &:has(input:checked) {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
  }

  &:has(input:focus-visible) {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
  }
`;

// Visually hidden but still in the tab order and arrow-key group — the native radio behaviour is the point.
export const SegmentInput = styled.input`
  position: absolute;
  inline-size: 0.0625rem;
  block-size: 0.0625rem;
  margin: -0.0625rem;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;
