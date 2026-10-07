import { styled } from "@linaria/react";
import { MONO_FONT } from "@/components/MotionPathBuilder/MotionPathBuilder.styles";

// Format tabs and the SMIL path option on one line, wrapping on narrow screens.
export const ExportHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem 1rem;
`;

// Tabs styled as destination boards on a platform — stencilled, with a brass underline on the live one.
export const TabRow = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 0.0625rem solid var(--color-border-muted);
`;

// One export format tab.
export const Tab = styled.button`
  padding: 0.5rem 0.75rem;
  font-family: ${MONO_FONT};
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-bottom: 0.1875rem solid transparent;
  margin-block-end: -0.0625rem;
  cursor: pointer;

  &[data-selected="true"] {
    color: var(--color-fg-default);
    border-bottom-color: var(--rail-loco);
  }

  &:focus-visible {
    outline: 0.125rem solid var(--color-fg-accent);
    outline-offset: -0.125rem;
  }
`;

// The two coordinate-system notes side by side — the one thing people trip over when moving between CSS and SMIL.
export const CoordinateNotes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 0.75rem;
`;

// One coordinate note, ruled off like a layout plan's annotation.
export const CoordinateNote = styled.div`
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-fg-muted);
  border-inline-start: 0.1875rem solid var(--rail-brass);
  background: color-mix(in oklab, var(--rail-brass) 8%, transparent);

  & strong {
    color: var(--color-fg-default);
  }

  & code {
    font-family: ${MONO_FONT};
    font-size: 0.75rem;
  }
`;
