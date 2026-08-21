import { styled } from "@linaria/react";

// Outer shell for the whole demo: header, controls form, live code, and live preview stack vertically inside one card.
export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--fluid-space-md);
  padding: var(--fluid-space-md);
  margin-block: var(--fluid-space-md);
  background: var(--color-bg-muted);
  border: var(--border-width-default) solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

// Demo title — sits above the controls, scoped to this panel rather than the page's own heading levels.
export const PanelHeader = styled.h4`
  margin: var(--space-none);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semi-bold);
  color: var(--color-fg-default);
`;

// Control row: wraps fields onto multiple lines on narrow viewports instead of forcing a horizontal scroll.
export const ControlsForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: var(--space-md);
`;

// Rendered SVG preview — same card treatment as SvgSnippet's preview.
export const PreviewPane = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--fluid-space-lg);
  background: var(--color-bg-default);
  border: var(--border-width-default) solid var(--color-border-muted);
  border-radius: 0.5rem;

  svg {
    max-inline-size: 100%;
    height: auto;
    /* Traces the exact viewBox extent so it's clear where the canvas ends and content gets clipped, rather than that boundary being invisible. */
    outline: var(--border-width-default) dashed var(--color-border-muted);
    outline-offset: -1px;
  }
`;
