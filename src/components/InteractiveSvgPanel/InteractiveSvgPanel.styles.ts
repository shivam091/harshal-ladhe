import { styled } from "@linaria/react";

// Outer shell for the whole demo: header, controls form, live code, and live preview stack vertically inside one card.
export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 1vw, 1rem);
  padding: clamp(0.75rem, 1vw, 1rem);
  margin-block: clamp(0.75rem, 1vw, 1rem);
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

// Demo title — sits above the controls, scoped to this panel rather than the page's own heading levels.
export const PanelHeader = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-fg-default);
`;

// Control row: wraps fields onto multiple lines on narrow viewports instead of forcing a horizontal scroll.
export const ControlsForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 0.75rem;
`;

// Rendered SVG preview — same card treatment as SvgSnippet's preview.
export const PreviewPane = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.5rem, 2vw, 2rem);
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;

  svg {
    max-inline-size: 100%;
    block-size: auto;
    /* Traces the exact viewBox extent so it's clear where the canvas ends and content gets clipped, rather than that boundary being invisible. */
    outline: 0.0625rem dashed var(--color-border-muted);
    outline-offset: -0.0625rem;
  }
`;
