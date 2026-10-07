"use client";

import { useId, useRef, useState } from "react";
import type { JSX } from "react";
import { authoredRadius, MAX_PRECISION, MIN_POINTS, MIN_PRECISION } from "@/components/ShapeToPathConverter/ShapeToPathConverter.helpers";
import { formatPointsList, parsePointsList, SHAPE_KINDS } from "@/components/ShapeToPathConverter/ShapeToPathConverter.utils";
import {
  ControlGroup,
  GroupLegend,
  KindGrid,
  KindOption,
  FieldGrid,
  Field,
  NumberInput,
  AutoToggle,
  PointsInput,
  ButtonRow,
  SmallButton,
  FieldError,
  SegmentRow,
  SelectInput
} from "@/components/ShapeToPathConverter/ShapeControls/ShapeControls.styles";
import type { NumberFieldProps, PointsEditorProps, Shape, ShapeControlsProps } from "@/components/ShapeToPathConverter/ShapeToPathConverter.types";

// Precision choices for the select, from whole units to four decimal places.
const PRECISION_OPTIONS = Array.from({ length: MAX_PRECISION - MIN_PRECISION + 1 }, (_, i) => MIN_PRECISION + i);

/*
  A numeric attribute with the live/checkpoint split: every keystroke or spinner click updates the
  drawing, and leaving the field records one undo step, only if something actually changed.
*/
function NumberField({ label, value, min, disabled = false, onChange, onCommit }: NumberFieldProps): JSX.Element {
  const dirty = useRef(false);
  return (
    <>
      <Field>
        {label}
        <NumberInput
          type="number"
          inputMode="decimal"
          step={1}
          min={min}
          value={value}
          disabled={disabled}
          onChange={(event) => {
            const next = event.target.valueAsNumber;
            if (!Number.isFinite(next)) return;
            dirty.current = true;
            onChange(next);
          }}
          onBlur={() => {
            if (!dirty.current) return;
            dirty.current = false;
            onCommit();
          }}
        />
      </Field>
    </>
  );
}

/*
  The points list as text, kept as a local draft so a half-typed pair never snaps back while it
  is being written. The draft re-syncs from the shape only when a drag or preset changes the
  points underneath it.
*/
function PointsEditor({ shape, actions }: PointsEditorProps): JSX.Element {
  const errorId = useId();
  const formatted = formatPointsList(shape.points);
  const [draft, setDraft] = useState(formatted);
  const [syncedFrom, setSyncedFrom] = useState(formatted);
  const [error, setError] = useState<string | null>(null);
  const dirty = useRef(false);
  const minimum = MIN_POINTS[shape.kind];

  if (formatted !== syncedFrom) {
    setSyncedFrom(formatted);
    setDraft(formatted);
    setError(null);
  }

  // Adds a point midway between the last one and the first, so the new edge lands somewhere sensible to drag from.
  function addPoint() {
    const last = shape.points[shape.points.length - 1] ?? { x: 50, y: 50 };
    const first = shape.points[0] ?? last;
    const point = { x: Math.round((last.x + first.x) / 2), y: Math.round((last.y + first.y) / 2 + 5) };
    actions.loadShape({ ...shape, points: [...shape.points, point] });
  }

  return (
    <>
      <ControlGroup>
        <GroupLegend>points</GroupLegend>
        <PointsInput
          aria-label={`${shape.kind} points list`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          spellCheck={false}
          value={draft}
          onChange={(event) => {
            const text = event.target.value;
            setDraft(text);
            const parsed = parsePointsList(text);
            setError(parsed.error);
            if (parsed.error) return;
            dirty.current = true;
            setSyncedFrom(formatPointsList(parsed.points));
            actions.setShape({ ...shape, points: parsed.points });
          }}
          onBlur={() => {
            if (!dirty.current) return;
            dirty.current = false;
            actions.commitEdit();
          }}
        />
        {error && <FieldError id={errorId}>{error}</FieldError>}
        <ButtonRow>
          <SmallButton type="button" onClick={addPoint}>
            Add a point
          </SmallButton>
          <SmallButton type="button" onClick={() => actions.loadShape({ ...shape, points: shape.points.slice(0, -1) })} disabled={shape.points.length <= minimum}>
            Remove the last point
          </SmallButton>
        </ButtonRow>
      </ControlGroup>
    </>
  );
}

// The attribute inputs for whichever shape is on the page.
function renderFields(shape: Shape, props: ShapeControlsProps): JSX.Element {
  const { actions } = props;
  const commit = actions.commitEdit;
  // Builds an onChange for one numeric attribute without spelling the spread out for every field.
  const set =
    <S extends Shape>(current: S, key: keyof S) =>
    (value: number) =>
      actions.setShape({ ...current, [key]: value });

  switch (shape.kind) {
    case "rect":
      return (
        <FieldGrid>
          <NumberField label="x" value={shape.x} onChange={set(shape, "x")} onCommit={commit} />
          <NumberField label="y" value={shape.y} onChange={set(shape, "y")} onCommit={commit} />
          <NumberField label="width" value={shape.width} min={0} onChange={set(shape, "width")} onCommit={commit} />
          <NumberField label="height" value={shape.height} min={0} onChange={set(shape, "height")} onCommit={commit} />
          {(["rx", "ry"] as const).map((axis) => (
            <div key={axis}>
              <NumberField
                label={axis}
                value={authoredRadius(shape, axis)}
                min={0}
                disabled={shape[axis] === null}
                onChange={(value) => actions.setShape({ ...shape, [axis]: value })}
                onCommit={commit}
              />
              <AutoToggle>
                <input
                  type="checkbox"
                  checked={shape[axis] === null}
                  onChange={(event) => actions.loadShape({ ...shape, [axis]: event.target.checked ? null : authoredRadius(shape, axis) })}
                />
                auto
              </AutoToggle>
            </div>
          ))}
        </FieldGrid>
      );
    case "circle":
      return (
        <FieldGrid>
          <NumberField label="cx" value={shape.cx} onChange={set(shape, "cx")} onCommit={commit} />
          <NumberField label="cy" value={shape.cy} onChange={set(shape, "cy")} onCommit={commit} />
          <NumberField label="r" value={shape.r} min={0} onChange={set(shape, "r")} onCommit={commit} />
        </FieldGrid>
      );
    case "ellipse":
      return (
        <FieldGrid>
          <NumberField label="cx" value={shape.cx} onChange={set(shape, "cx")} onCommit={commit} />
          <NumberField label="cy" value={shape.cy} onChange={set(shape, "cy")} onCommit={commit} />
          <NumberField label="rx" value={shape.rx} min={0} onChange={set(shape, "rx")} onCommit={commit} />
          <NumberField label="ry" value={shape.ry} min={0} onChange={set(shape, "ry")} onCommit={commit} />
        </FieldGrid>
      );
    case "line":
      return (
        <FieldGrid>
          <NumberField label="x1" value={shape.x1} onChange={set(shape, "x1")} onCommit={commit} />
          <NumberField label="y1" value={shape.y1} onChange={set(shape, "y1")} onCommit={commit} />
          <NumberField label="x2" value={shape.x2} onChange={set(shape, "x2")} onCommit={commit} />
          <NumberField label="y2" value={shape.y2} onChange={set(shape, "y2")} onCommit={commit} />
        </FieldGrid>
      );
    default:
      return <PointsEditor key={shape.kind} shape={shape} actions={actions} />;
  }
}

/*
  The question being set: which shape, its attributes, and how the answer should be written out
  (absolute or relative commands, how many decimal places).
*/
export default function ShapeControls(props: ShapeControlsProps): JSX.Element {
  const { state, actions } = props;
  const shape = state.shapes[state.kind];
  const precisionId = useId();

  return (
    <>
      <ControlGroup>
        <GroupLegend>Shape</GroupLegend>
        <KindGrid>
          {SHAPE_KINDS.map((kind) => (
            <KindOption key={kind}>
              <input type="radio" name="shape-to-path-kind" value={kind} checked={state.kind === kind} onChange={() => actions.setKind(kind)} />
              {`<${kind}>`}
            </KindOption>
          ))}
        </KindGrid>
      </ControlGroup>

      <ControlGroup>
        <GroupLegend>{`<${shape.kind}> attributes`}</GroupLegend>
        {renderFields(shape, props)}
      </ControlGroup>

      <ControlGroup>
        <GroupLegend>Path commands</GroupLegend>
        <SegmentRow>
          {(["absolute", "relative"] as const).map((mode) => (
            <KindOption key={mode} style={{ flex: 1 }}>
              <input type="radio" name="shape-to-path-mode" value={mode} checked={state.mode === mode} onChange={() => actions.setMode(mode)} />
              {mode === "absolute" ? "Absolute (M L A)" : "Relative (m l a)"}
            </KindOption>
          ))}
        </SegmentRow>
        <Field htmlFor={precisionId}>
          Decimal places
          <SelectInput id={precisionId} value={state.precision} onChange={(event) => actions.setPrecision(Number(event.target.value))}>
            {PRECISION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === 0 ? "0 (whole units)" : option}
              </option>
            ))}
          </SelectInput>
        </Field>
      </ControlGroup>
    </>
  );
}

ShapeControls.displayName = "ShapeControls";
