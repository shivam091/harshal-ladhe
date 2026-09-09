import { styled } from "@linaria/react";

// Outer shell for the whole tool — matches every other goodie's own GeneratorWrapper so all read as one family.
export const GeneratorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;

// Holds the undo/redo/reset icon buttons above the two-column layout below.
export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// One square icon button in the toolbar — undo/redo/reset all share this exact treatment.
export const ToolbarButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  inline-size: 2rem;
  block-size: 2rem;
  padding: 0;
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.375rem;
  background: var(--color-bg-muted);
  color: var(--color-fg-muted);
  cursor: pointer;
  transition: color 150ms ease, background 150ms ease, border-color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
    background: var(--color-bg-neutral-muted);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// Single column on narrow viewports, controls-beside-preview from 60rem up — matches every other goodie's own two-column breakpoint.
export const GeneratorGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: 20rem minmax(0, 1fr);
    align-items: start;
  }
`;

// The narrow left column: tracks/gap, areas, presets, share — stacked top to bottom.
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// The wide right column: live preview above the export panel.
export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

// One bordered card grouping a related set of controls — every SidePanel/MainColumn section is one of these.
export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

// Small uppercase heading at the top of a SectionCard.
export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-fg-muted);
`;
