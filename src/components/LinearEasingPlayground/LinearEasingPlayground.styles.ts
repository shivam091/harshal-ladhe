import { styled } from "@linaria/react";
import {
  Handle as BaseHandle,
  Readout as BaseReadout,
  Code as BaseCode,
} from "@/components/CubicBezierPlayground/CubicBezierPlayground.styles";

export { Ghost, SelectWrapper, Select } from "@/components/CurveRace/CurveRace.styles";
export {
  Wrapper,
  GraphWrapper,
  GuideLine,
  PreviewRow,
  PreviewTrack,
  PreviewBox,
} from "@/components/CubicBezierPlayground/CubicBezierPlayground.styles";

// The piecewise-linear curve connecting every resolved stop.
export const Curve = styled.polyline`
  stroke: var(--color-fg-accent);
  stroke-width: 5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`;

// A draggable stop handle — filled when pinned to an exact percentage, muted when auto-spaced.
export const Handle = styled(BaseHandle)`
  &[data-auto] {
    fill: var(--color-fg-muted);
  }
`;

// Row pairing the generated linear() readout with its copy button — wraps, unlike CubicBezierPlayground's, since a long generated linear() value runs longer than a fixed cubic-bezier() one.
export const Readout = styled(BaseReadout)`
  flex-wrap: wrap;
`;

// Monospace readout of the current linear() value — centered and allowed to break, unlike CubicBezierPlayground's fixed-length one.
export const Code = styled(BaseCode)`
  text-align: center;
  word-break: break-all;
`;

// Row of preset picker plus add/reset controls, above the per-stop list.
export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-block-start: var(--space-lg);
`;

// Per-stop list of value/position editors, below the graph and controls.
export const StopList = styled.ul`
  list-style: none;
  margin: var(--space-lg) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

// One editable stop row.
export const StopRow = styled.li`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-sm);
  font-size: var(--font-size-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--border-radius-sm);
  background: var(--color-bg-default);
  border: var(--border-width-thin) solid var(--color-border-muted);
`;

// Muted field label ("Stop 1", "value", fixed-position note).
export const StopLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xxs);
  color: var(--color-fg-muted);
`;

// Compact numeric input for a stop's value or pinned position.
export const NumberField = styled.input`
  inline-size: 4.5em;
  padding: var(--space-xxs) var(--space-xs);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--border-radius-sm);
  background: var(--color-bg-control);
  color: var(--color-fg-default);
  font-family: var(--font-stack-monospace);
  font-size: var(--font-size-xs);

  &:disabled {
    opacity: var(--opacity-medium);
  }
`;

// "Pin at __%" checkbox + field, for stops that aren't the fixed first/last anchors.
export const PinLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xxs);
  color: var(--color-fg-muted);
  cursor: pointer;

  & input[type="checkbox"] {
    accent-color: var(--color-fg-accent);
  }
`;
