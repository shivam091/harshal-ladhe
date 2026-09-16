import { styled } from "@linaria/react";

// Row holding the dial(s)/pad the current gradient type needs — centers a single control, or spaces a conic gradient's dial+pad pair evenly.
export const DialRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
`;

// Linear-only quick-direction row beneath the dial — a keyword shorthand for the same angle AngleDial already drives, not a second source of truth.
export const DirectionPresetRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.375rem;
`;

// One keyword direction (e.g. "Left", "Top Right") that snaps AngleDial's own angle to that direction's equivalent degree value.
export const DirectionPresetButton = styled.button`
  padding: 0.3125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: color-mix(in srgb, var(--color-bg-default) 70%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  border-radius: 624.9375rem;
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover {
    color: var(--color-fg-default);
    border-color: var(--color-fg-accent);
  }

  &[data-selected="true"] {
    color: var(--color-fg-on-emphasis);
    background: var(--color-bg-accent-emphasis);
    border-color: transparent;
  }
`;

// Label+select stack for the radial-only shape/size fields — also reused by ColorSpaceControls' hue-interpolation select, mirroring how RegexTester's MatchHighlight reuses PatternControls' own FieldWrapper/FieldLabel.
export const SelectField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

// Small-caps label above a SelectInput.
export const SelectFieldLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

// Wraps SelectInput to draw a theme-aware chevron via a mask-image, the same trick CronBuilder's own FieldBuilder select uses.
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

// Custom-chevron select, glass-tinted to match every other inset field in this tool.
export const SelectInput = styled.select`
  appearance: none;
  inline-size: 100%;
  padding: 0.375rem 1.75rem 0.375rem 0.5rem;
  font-family: inherit;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: color-mix(in srgb, var(--color-bg-default) 70%, transparent);
  border: 0.0625rem solid color-mix(in srgb, var(--color-border-default) 60%, transparent);
  border-radius: 0.375rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-fg-accent);
    box-shadow: 0 0 0 0.1875rem color-mix(in srgb, var(--color-fg-accent) 22%, transparent);
  }
`;
