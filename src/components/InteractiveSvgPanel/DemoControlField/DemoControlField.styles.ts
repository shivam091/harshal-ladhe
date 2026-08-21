import { styled } from "@linaria/react";

// One control's wrapper — stacks label above input; row layout for checkboxes via [data-inline].
export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-inline-size: 8rem;

  &[data-inline="true"] {
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
`;

// Field label — smaller and muted than a full form's label, since these sit in a dense demo toolbar.
export const FieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
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

// Min/max bound label at either end of a range track.
export const RangeEdge = styled.span`
  flex: 0 0 auto;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
`;

/*
  Wraps the range input and its floating value bubble; the top padding reserves room for the
  bubble (fixed line-height + vertical padding) plus its 4px tail — 28px so the tail always has
  clear headroom above the thumb regardless of font-metric variance across browsers.
*/
export const RangeTrack = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-inline-size: 0;
  padding-top: 1.5rem;
`;

// Floating current-value readout that tracks the thumb's horizontal position.
export const RangeBubble = styled.output`
  position: absolute;
  top: calc(-1 * 0.25rem);
  transform: translateX(-50%);
  padding: 0.125rem 0.25rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  color: var(--color-fg-on-emphasis);
  background: var(--color-bg-accent-emphasis);
  border-radius: 0.1875rem;
  white-space: nowrap;
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 0.25rem solid transparent;
    border-top-color: var(--color-bg-accent-emphasis);
  }
`;

/*
  Range slider — custom track + thumb (native appearance fully replaced) so the floating bubble above
  reads as one cohesive control, matching the CSS Grid sandboxes' sliders.
*/
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
    cursor: pointer;
  }
`;

// Color swatch input — square, matching the other controls' now-square border treatment.
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
    box-shadow: 0 0 0 3px color-mix(
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
  Wraps a select so its arrow (drawn via ::after) can stay theme-aware — a background-image data
  URI can't pick up currentColor since it's a separate resource, so the arrow is masked instead:
  the mask supplies only the chevron's shape, and background-color supplies the live color token.
  The SVG stroke must be white, not black: standard mask-image defaults to luminance mode (mask
  value = alpha * luminance), and black has zero luminance, so a black stroke masks out to nothing
  — only -webkit-mask-image's legacy alpha-based default would've shown it. White has luminance 1,
  so it renders correctly under both luminance and alpha masking.
*/
export const SelectWrapper = styled.div`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 10px;
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
  padding: 0.25rem 30px 0.25rem 0.5rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: var(--color-fg-default);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0;
  cursor: pointer;
`;

// Toggle checkbox — native control, sized up slightly for an easier touch target.
export const CheckboxInput = styled.input`
  inline-size: 1rem;
  block-size: 1rem;
  accent-color: var(--color-bg-accent-emphasis);
  cursor: pointer;
`;
