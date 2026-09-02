import { styled } from "@linaria/react";

// Outer shell for the whole tool — matches every other goodie's own GeneratorWrapper so all five read as one family.
export const GeneratorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: clamp(0.75rem, 1vw, 1rem);
`;

export const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

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

export const GeneratorGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;

  @media (min-width: 60rem) {
    grid-template-columns: 20rem minmax(0, 1fr);
    align-items: start;
  }
`;

export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

export const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-inline-size: 0;
`;

export const SectionCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.875rem;
  background: var(--color-bg-muted);
  border: 0.0625rem solid var(--color-border-muted);
  border-radius: 0.5rem;
`;

export const PanelTitle = styled.h3`
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--color-fg-muted);
`;
