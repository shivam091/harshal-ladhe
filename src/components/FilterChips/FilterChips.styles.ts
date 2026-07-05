import { styled } from "@linaria/react";

// Wraps onto new lines on narrow screens so chips never force a horizontal scroll.
export const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-end: clamp(1rem, 1.25vw, 1.5rem);
`;

/*
  Pill-shaped, unlike static badges, to signal it's interactive; the active state uses the
  accent tokens so a selected filter reads as "on" wherever chips appear.
*/
export const FilterChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  font-size: clamp(0.9375rem, 1.8vw, 1rem);
  font-weight: 500;
  line-height: 1.25;
  color: var(--color-fg-muted);
  background-color: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 624.9375rem;
  cursor: pointer;
  transition-property: background-color, border-color, color;
  transition-duration: 150ms;
  transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);

  &:hover:not(:disabled) {
    @media (hover: hover) {
      color: var(--color-fg-default);
      border-color: var(--color-border-accent-muted);
    }
  }

  &[aria-pressed="true"] {
    color: var(--color-fg-accent);
    background-color: var(--color-bg-accent-muted);
    border-color: var(--color-border-accent-muted);
  }

  // Faded rather than hidden so the chip row keeps the same shape on every list.
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Tinted by currentColor so the count follows the chip's idle, hover, and pressed colours without extra rules.
export const FilterChipCount = styled.span`
  min-inline-size: 1.5rem;
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.25;
  text-align: center;
  background-color: color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 624.9375rem;
`;
