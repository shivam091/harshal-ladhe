import { styled } from "@linaria/react";

// Horizontally scrollable so a container wider than the side panel's remaining space (this tool's containerWidth slider goes up to 900px) never breaks the page's own layout — the stage is meant to overflow its own card on a narrow viewport, not shrink the thing being previewed.
export const PreviewScroller = styled.div`
  overflow-x: auto;
  padding: 0.5rem;
  background-image:
    linear-gradient(45deg, var(--color-bg-neutral-muted) 25%, transparent 25%),
    linear-gradient(-45deg, var(--color-bg-neutral-muted) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--color-bg-neutral-muted) 75%),
    linear-gradient(-45deg, transparent 75%, var(--color-bg-neutral-muted) 75%);
  background-size: 1.25rem 1.25rem;
  background-position: 0 0, 0 0.625rem, 0.625rem -0.625rem, -0.625rem 0;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

// The actual live flex/grid container — every container property (display, direction/wrap or template columns/rows, alignment, gap) is set inline per-render from compileContainerStyle, so this genuinely IS the layout being edited, not a stand-in swatch.
export const Container = styled.div`
  min-block-size: 12rem;
  padding: 1rem;
  background: var(--color-bg-default);
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 2.5rem;
  min-block-size: 2.5rem;
  padding: 0.75rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--color-fg-on-emphasis);
  border-radius: 0.375rem;

  &[data-selected="true"] {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: 0.125rem;
  }
`;
