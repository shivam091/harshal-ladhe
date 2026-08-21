import { styled } from "@linaria/react";

// Same label-over-input skeleton for every control type so a mixed row lines up.
export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-inline-size: 8rem;
`;

// Field label — smaller and muted than a full form's label, since these sit in a dense demo toolbar.
export const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

/*
  Reserves a label's height above a checkbox, whose label sits beside it, so every control type
  in a row starts at the same vertical offset.
*/
export const FieldLabelSpacer = styled(FieldLabel)`
  visibility: hidden;
`;

// Checkbox first in the DOM for native reading order, reversed visually so it stays pinned to the end.
export const CheckboxRow = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
`;

/*
  Row flanking a range track with its min/max bounds — left: min value, right: max allowed
  value — matching the slider layout used across the CSS Grid sandboxes.
*/
export const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Shows the bounds so readers know a slider's range before dragging it.
export const RangeEdge = styled.span`
  flex: 0 0 auto;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

/*
  Wraps the range input and its floating value bubble; the top padding reserves room for the
  bubble (fixed line-height + vertical padding) plus its 4px tail — 22px, matching the shared
  Sandpack playgrounds' .range-track (sandboxes/_shared/range-slider.css), so the tail always has
  clear headroom above the thumb regardless of font-metric variance across browsers.
*/
export const RangeTrack = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-inline-size: 0;
  padding-block-start: 1.375rem;
`;

// Shows the exact value while dragging, since a bare thumb position is too imprecise to read.
export const RangeBubble = styled.output`
  position: absolute;
  inset-block-start: 0;
  transform: translateX(-50%);
  padding: 0.0625rem 0.375rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.7rem;
  font-weight: 600;
  line-height: 1;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-accent-emphasis);
  border-radius: 0.25rem;
  white-space: nowrap;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    inset-block-start: 100%;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    border: 0.25rem solid transparent;
    border-block-start-color: var(--color-bg-accent-emphasis);
  }
`;

// Native appearance replaced so the slider and its bubble read as one control, matching the CSS Grid sandboxes.
export const RangeInput = styled.input`
  display: block;
  inline-size: 100%;
  block-size: 0.25rem;
  border-radius: 0.125rem;
  background: var(--color-border-muted);
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    inline-size: 1rem;
    block-size: 1rem;
    border-radius: 50%;
    background: var(--color-bg-accent-emphasis);
    border: 0.125rem solid var(--color-bg-default);
    box-shadow: var(--box-shadow-sm);
    cursor: pointer;
  }

  &::-moz-range-track {
    block-size: 0.25rem;
    border-radius: 0.125rem;
    background: var(--color-border-muted);
  }

  &::-moz-range-thumb {
    inline-size: 1rem;
    block-size: 1rem;
    border: 0.125rem solid var(--color-bg-default);
    border-radius: 50rem;
    background: var(--color-bg-accent-emphasis);
    box-shadow: var(--box-shadow-sm);
    cursor: pointer;
  }
`;

// Square swatch so it lines up with the other controls' border treatment.
export const ColorInput = styled.input`
  appearance: none;
  inline-size: 100%;
  block-size: 1.75rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0;
  background: transparent;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-bg-accent-emphasis);
    box-shadow: 0 0 0 0.1875rem color-mix(
      in srgb,
      var(--color-bg-accent-emphasis) 30%,
      transparent
    );
  }

  &::-webkit-color-swatch-wrapper {
    padding: 0.125rem;
  }

  &::-webkit-color-swatch {
    border: none;
  }
`;

/*
  Masked ::after arrow so it can follow the theme colour, which a data-URI background can't. The SVG
  stroke must be white: mask-image defaults to luminance mode, where black masks out to nothing, while
  white works under both luminance and -webkit-'s alpha masking.
*/
export const SelectWrapper = styled.div`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 0.625rem;
    inline-size: 0.75rem;
    block-size: 0.75rem;
    transform: translateY(-50%);
    background-color: var(--color-fg-muted);
    mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5'/%3E%3C/svg%3E");
    mask-repeat: no-repeat;
    mask-size: 100%;
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5'/%3E%3C/svg%3E");
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 100%;
    pointer-events: none;
  }
`;

// Dropdown control for fixed-choice attributes (e.g. stroke-linecap's butt/round/square).
export const SelectInput = styled.select`
  appearance: none;
  inline-size: 100%;
  padding: 0.25rem 1.875rem 0.25rem 0.5rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-bg-accent-emphasis);
    box-shadow: 0 0 0 0.1875rem color-mix(
      in srgb,
      var(--color-bg-accent-emphasis) 30%,
      transparent
    );
  }
`;

/*
  Square rather than a round dot so it reads as "toggle on/off", not "pick one", matching the Sandpack
  playgrounds' checkbox. The tick is literal white since a data-URI image can't read custom properties.
*/
export const CheckboxInput = styled.input`
  flex: 0 0 auto;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  margin: 0;
  appearance: none;
  background-color: var(--color-bg-default);
  border: 0.09375rem solid var(--color-border-default);
  border-radius: 0;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;

  &:checked {
    background-color: var(--color-bg-accent-emphasis);
    border-color: var(--color-bg-accent-emphasis);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3.5 8.5L6.5 11.5L12.5 4.5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 0.6875rem;
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-bg-accent-emphasis);
    outline-offset: 0.125rem;
  }
`;
