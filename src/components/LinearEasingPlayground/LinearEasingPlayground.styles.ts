import { styled } from "@linaria/react";
import Button from "@/components/Button";
import {
  Handle as BaseHandle,
  Readout as BaseReadout,
  Code as BaseCode
} from "@/components/CubicBezierPlayground/CubicBezierPlayground.styles";

export { Ghost } from "@/components/CurveRace/CurveRace.styles";
export {
  Wrapper,
  GraphWrapper,
  GuideLine,
  PreviewRow,
  PreviewTrack,
  PreviewBox
} from "@/components/CubicBezierPlayground/CubicBezierPlayground.styles";

// Round joins soften the corner at each stop without hiding where it is.
export const Curve = styled.polyline`
  stroke: var(--color-fg-accent);
  stroke-width: 5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
`;

// Muted when auto-spaced, so readers can tell at a glance which stops are pinned.
export const Handle = styled(BaseHandle)`
  &[data-auto] {
    fill: var(--color-fg-muted);
  }
`;

// Wraps because a long linear() value can outgrow the row, unlike a fixed-length cubic-bezier().
export const Readout = styled(BaseReadout)`
  flex-wrap: wrap;
`;

// Allowed to break anywhere, since a long linear() value has no natural break points.
export const Code = styled(BaseCode)`
  text-align: center;
  word-break: break-all;
`;

// Groups the actions that change the whole curve, apart from the per-stop editors.
export const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-block-start: 1.5rem;
`;

/*
  Fixed block-size so Add stop / Reset line up with the neighbouring sm Select: Button's sm size
  is sized off icon + padding, which otherwise lands well short of the Select's 2rem.
*/
export const ControlButton = styled(Button)`
  block-size: 2rem;
`;

// Exact numeric editing for when dragging isn't precise enough.
export const StopList = styled.ul`
  list-style: none;
  margin: 1.5rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

// Wraps on narrow screens so a row never forces sideways scrolling.
export const StopRow = styled.li`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.1875rem;
  background: var(--color-bg-default);
  border: 0.0625rem solid var(--color-border-muted);
`;

// Muted so the numbers, not their labels, draw the eye.
export const StopLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.1875rem;
  color: var(--color-fg-muted);
`;

// Monospace so digits line up from row to row.
export const NumberField = styled.input`
  inline-size: 4.5em;
  padding: 0.1875rem 0.25rem;
  border: 0.0625rem solid var(--color-border-default);
  border-radius: 0.1875rem;
  background: var(--color-bg-control);
  color: var(--color-fg-default);
  font-family: 'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.75rem;

  &:disabled {
    opacity: 0.5;
  }
`;

// The whole label is clickable, giving the small checkbox a bigger target.
export const PinLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.1875rem;
  color: var(--color-fg-muted);
  cursor: pointer;

  & input[type="checkbox"] {
    accent-color: var(--color-fg-accent);
  }
`;
