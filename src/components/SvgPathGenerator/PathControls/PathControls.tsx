import type { JSX } from "react";
import type { PathControlsProps, SvgLineCap, SvgLineJoin } from "@/interfaces/svg-path";
import {
  FieldWrapper,
  FieldLabel,
  RangeRow,
  RangeEdge,
  RangeTrack,
  RangeBubble,
  RangeInput,
  SelectWrapper,
  SelectInput,
  ColorInput,
  CheckboxInput
} from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { FieldsColumn, ClosedRow, ClosedButton, FillRow } from "@/components/SvgPathGenerator/PathControls/PathControls.styles";

const LINE_CAPS: SvgLineCap[] = ["butt", "round", "square"];
const LINE_JOINS: SvgLineJoin[] = ["miter", "round", "bevel"];

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  onCommit: () => void;
}

// Local slider wired to this tool's live/checkpoint split: every drag tick calls onChange (no undo entry — see useUndoStack's setPresent), release calls onCommit once. Reuses DemoControlField's slider chrome directly, exactly as ClipPathGenerator's own ShapeControls does.
function Slider({ label, min, max, value, onChange, onCommit }: SliderProps): JSX.Element {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const bubbleOffset = 8 - (percent / 100) * 16;

  return (
    <>
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <RangeRow>
          <RangeEdge>{min}</RangeEdge>
          <RangeTrack>
            <RangeBubble style={{ left: `calc(${percent}% + ${bubbleOffset}px)` }}>{Math.round(value)}</RangeBubble>
            <RangeInput
              type="range"
              min={min}
              max={max}
              value={value}
              onChange={(event) => onChange(event.target.valueAsNumber)}
              onPointerUp={onCommit}
              onKeyUp={onCommit}
            />
          </RangeTrack>
          <RangeEdge>{max}</RangeEdge>
        </RangeRow>
      </FieldWrapper>
    </>
  );
}

/*
  Open/closed toggle, stroke/fill styling, and the pen-tool help text — grouped here rather than
  split further since they're all "how the path looks," matching ShapeControls' own single-panel scope.
*/
export default function PathControls({ state, actions }: PathControlsProps): JSX.Element {
  return (
    <>
      <FieldsColumn>
        <FieldWrapper>
          <FieldLabel>Closure</FieldLabel>
          <ClosedRow role="radiogroup" aria-label="Path closure">
            <ClosedButton type="button" role="radio" aria-checked={!state.closed} data-selected={!state.closed ? "true" : undefined} onClick={() => state.closed && actions.toggleClosed()}>
              Open
            </ClosedButton>
            <ClosedButton type="button" role="radio" aria-checked={state.closed} data-selected={state.closed ? "true" : undefined} onClick={() => !state.closed && actions.toggleClosed()}>
              Closed
            </ClosedButton>
          </ClosedRow>
        </FieldWrapper>

        <FieldWrapper>
          <FieldLabel htmlFor="svg-path-stroke-color">Stroke</FieldLabel>
          <ColorInput id="svg-path-stroke-color" type="color" value={state.strokeColor} onChange={(event) => actions.setStrokeColor(event.target.value)} />
        </FieldWrapper>

        <Slider label="Stroke width" min={0} max={20} value={state.strokeWidth} onChange={actions.setStrokeWidth} onCommit={actions.commitDrag} />

        <FieldWrapper>
          <FieldLabel htmlFor="svg-path-line-cap">Line cap</FieldLabel>
          <SelectWrapper>
            <SelectInput id="svg-path-line-cap" value={state.lineCap} onChange={(event) => actions.setLineCap(event.target.value as SvgLineCap)}>
              {LINE_CAPS.map((cap) => (
                <option key={cap} value={cap}>
                  {cap[0].toUpperCase() + cap.slice(1)}
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>

        <FieldWrapper>
          <FieldLabel htmlFor="svg-path-line-join">Line join</FieldLabel>
          <SelectWrapper>
            <SelectInput id="svg-path-line-join" value={state.lineJoin} onChange={(event) => actions.setLineJoin(event.target.value as SvgLineJoin)}>
              {LINE_JOINS.map((join) => (
                <option key={join} value={join}>
                  {join[0].toUpperCase() + join.slice(1)}
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>

        <FieldWrapper>
          <FillRow>
            <CheckboxInput type="checkbox" checked={state.fillEnabled} onChange={(event) => actions.setFillEnabled(event.target.checked)} />
            Fill
          </FillRow>
        </FieldWrapper>

        {state.fillEnabled && (
          <FieldWrapper>
            <FieldLabel htmlFor="svg-path-fill-color">Fill color</FieldLabel>
            <ColorInput id="svg-path-fill-color" type="color" value={state.fillColor} onChange={(event) => actions.setFillColor(event.target.value)} />
          </FieldWrapper>
        )}

        <FieldWrapper>
          <FieldLabel>Points</FieldLabel>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-fg-muted)" }}>
            Drag a point to move it, double-click to add/remove its curve, click an edge to insert a point, click empty space to add one at the end, or press Delete on a selected point.
          </p>
        </FieldWrapper>
      </FieldsColumn>
    </>
  );
}

PathControls.displayName = "PathControls";
