import { styled } from "@linaria/react";

// Stack of the four corner rows.
export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// One corner's own row — a soft rounded chip rather than a plain grid row, so each corner reads as its own small pinch of clay with a highlighted outline while its handle is being dragged on the preview.
export const CornerRow = styled.div`
  display: grid;
  grid-template-columns: 5.5rem 1fr 1fr;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.875rem;
  transition: background 150ms ease, box-shadow 150ms ease;

  &[data-selected="true"] {
    background: color-mix(in srgb, var(--color-fg-accent) 10%, transparent);
    box-shadow: inset 0 0 0 0.09375rem var(--color-fg-accent);
  }
`;

export const CornerLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-fg-muted);
`;

export const AxisField = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// Lighter than CornerLabel — a secondary "H"/"V" axis marker, not the corner's own name.
export const AxisPrefix = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: color-mix(in srgb, var(--color-fg-muted) 65%, transparent);
`;

// Numeric corner input — pill-shaped rather than the sharp-cornered field most tools use, another small wink at the theme.
export const AxisInput = styled.input`
  inline-size: 100%;
  min-inline-size: 0;
  padding: 0.3125rem 0.625rem;
  font-size: 0.8125rem;
  color: var(--color-fg-default);
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 999px;

  &:focus {
    outline: none;
    border-color: var(--color-fg-accent);
  }
`;
