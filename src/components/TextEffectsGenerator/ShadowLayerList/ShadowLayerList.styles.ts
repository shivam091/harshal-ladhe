import { styled } from "@linaria/react";

// Vertical list of spec rows — no border/gap of its own; each row supplies its own ruled divider, so the whole list reads as one continuously ruled column rather than a stack of separate tiles.
export const Manuscript = styled.ul`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

/*
  One shadow layer's row in the spec sheet. Deliberately flat — a hairline divider between rows and
  a left-edge proofing mark on the active row are the ONLY things distinguishing state here, unlike
  BoxShadowGenerator's LayerRow (which lifts a card off a simulated tabletop on hover/select). This
  is the interaction-feel contrast the brief calls for: a list you annotate, not a stack you pick up.
*/
export const SpecRow = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.25rem 0.5rem 0.625rem;
  border-block-end: 0.0625rem solid var(--color-border-muted);

  &:first-of-type {
    border-block-start: 0.0625rem solid var(--color-border-muted);
  }

  /*
    The proofing mark — a red editorial pencil bar along the row's leading edge, the same ink as
    PressDot, standing in for a proofreader's margin mark flagging "this is the line being worked
    on" rather than BoxShadowGenerator's raised/lifted card treatment.
  */
  &::before {
    content: "";
    position: absolute;
    inset-block: 0.25rem;
    inset-inline-start: 0;
    inline-size: 0.1875rem;
    background: transparent;
    transition: background 150ms ease;
  }

  &[data-selected="true"]::before {
    background: var(--color-fg-danger);
  }
`;

// The row's own index, printed like a manuscript page/line number rather than a decorative bullet.
export const SpecNumber = styled.span`
  flex: 0 0 auto;
  min-inline-size: 1.25rem;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-fg-muted);
`;

// The row's selectable content — a swatch plus its spec readout, filling the space between the line number and the action icons.
export const SpecButton = styled.button`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 0.5rem;
  min-inline-size: 0;
  padding: 0;
  text-align: start;
  background: transparent;
  border: none;
  cursor: pointer;
`;

// Small square ink-sample swatch previewing the layer's shadow color — square, not round, to read as a printed color chip rather than a UI color picker.
export const SpecSwatch = styled.span`
  flex: 0 0 auto;
  inline-size: 1.125rem;
  block-size: 1.125rem;
  border: 0.0625rem solid var(--color-border-default);
`;

// Monospace offset/blur/opacity readout formatted like a print production note (e.g. "Δx2 Δy2 ↝4 40%") so the manuscript alone tells you what's stacked without opening each row.
export const SpecReadout = styled.span`
  flex: 1 1 auto;
  min-inline-size: 0;
  overflow: hidden;
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--color-fg-muted);
  white-space: nowrap;
  text-overflow: ellipsis;
`;

// Row of small icon buttons for duplicating/removing a layer.
export const SpecActions = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: 0.125rem;
`;

// One icon button inside SpecActions.
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 1.75rem;
  block-size: 1.75rem;
  padding: 0;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 150ms ease;

  &:hover:not(:disabled) {
    color: var(--color-fg-default);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// "Add layer" printed as a manuscript's own appended note rather than a boxed button — a dashed rule above plain caption text.
export const AddLayerButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  margin: 0.625rem 0.625rem 0;
  padding-block-start: 0.625rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-fg-muted);
  background: transparent;
  border: none;
  border-block-start: 0.0625rem dashed var(--color-border-default);
  cursor: pointer;
  transition: color 150ms ease;

  &:hover {
    color: var(--color-fg-default);
  }
`;

// Shown in place of the manuscript when every layer has been removed — `text-shadow: none` is valid CSS, so this is a real (if unusual) state rather than an error.
export const EmptyState = styled.p`
  margin: 0;
  padding: 0.75rem 0.625rem;
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--color-fg-muted);
`;
