import { styled } from "@linaria/react";

// Vertical stack of the selected layer's fields — offset/blur/opacity sliders, then color.
export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

// Shown in place of Fields when no layer is selected — plain caption text rather than a boxed empty state, matching this theme's flat, ruled-off language.
export const EmptyState = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: var(--color-fg-muted);
`;
