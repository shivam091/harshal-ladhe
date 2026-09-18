import type { JSX } from "react";
import type { ShapeControlsProps, ClipPathShapeFamily, ClipPathPreviewSubject } from "@/interfaces/clip-path";
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
  ColorInput
} from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import {
  FieldsColumn,
  ImageOptionRow,
  ImageOption,
  SubjectRow,
  SubjectButton,
  TextInput
} from "@/components/ClipPathGenerator/ShapeControls/ShapeControls.styles";

const PREVIEW_IMAGES = ["hl-standing", "hl-sitting", "hl-smiling-face"];
const FAMILIES: ClipPathShapeFamily[] = ["polygon", "circle", "ellipse", "inset"];
const SUBJECTS: ClipPathPreviewSubject[] = ["color", "image", "text"];

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  onCommit: () => void;
}

// Local slider wired to this tool's live/checkpoint split: every drag tick calls onChange (no undo entry — see useUndoStack's setPresent), release calls onCommit once. Reuses DemoControlField's slider chrome directly rather than re-implementing the floating-bubble track.
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
  Shape family switcher plus every per-family numeric field, and the preview subject controls
  (color/image/text) — grouped here rather than split into their own component since they're all
  "how the shape/preview looks," not distinct concerns with their own state machines like MorphControls.
*/
export default function ShapeControls({ state, actions }: ShapeControlsProps): JSX.Element {
  const { shape } = state;

  return (
    <>
      <FieldsColumn>
        <FieldWrapper>
          <FieldLabel htmlFor="clip-path-family">Shape</FieldLabel>
          <SelectWrapper>
            <SelectInput
              id="clip-path-family"
              value={shape.family}
              onChange={(event) => actions.setFamily(event.target.value as ClipPathShapeFamily)}
            >
              {FAMILIES.map((family) => (
                <option key={family} value={family}>
                  {family[0].toUpperCase() + family.slice(1)}
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>

        {shape.family === "circle" && (
          <Slider
            label="Radius"
            min={0}
            max={70}
            value={shape.radius}
            onChange={(radius) => actions.updateCircle({ radius })}
            onCommit={actions.commitDrag}
          />
        )}

        {shape.family === "ellipse" && (
          <>
            <Slider label="Radius X" min={0} max={70} value={shape.rx} onChange={(rx) => actions.updateEllipse({ rx })} onCommit={actions.commitDrag} />
            <Slider label="Radius Y" min={0} max={70} value={shape.ry} onChange={(ry) => actions.updateEllipse({ ry })} onCommit={actions.commitDrag} />
          </>
        )}

        {shape.family === "inset" && (
          <>
            <Slider label="Top" min={0} max={49} value={shape.top} onChange={(top) => actions.updateInset({ top })} onCommit={actions.commitDrag} />
            <Slider label="Right" min={0} max={49} value={shape.right} onChange={(right) => actions.updateInset({ right })} onCommit={actions.commitDrag} />
            <Slider label="Bottom" min={0} max={49} value={shape.bottom} onChange={(bottom) => actions.updateInset({ bottom })} onCommit={actions.commitDrag} />
            <Slider label="Left" min={0} max={49} value={shape.left} onChange={(left) => actions.updateInset({ left })} onCommit={actions.commitDrag} />
            <Slider
              label="Corner radius"
              min={0}
              max={50}
              value={shape.cornerRadius}
              onChange={(cornerRadius) => actions.updateInset({ cornerRadius })}
              onCommit={actions.commitDrag}
            />
          </>
        )}

        {shape.family === "polygon" && (
          <FieldWrapper>
            <FieldLabel>Points</FieldLabel>
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-fg-muted)" }}>
              Drag a point to move it, double-click to add/remove its curve, click an edge to insert a point, or press Delete on a selected point.
            </p>
          </FieldWrapper>
        )}

        <FieldWrapper>
          <FieldLabel>Preview subject</FieldLabel>
          <SubjectRow role="radiogroup" aria-label="Preview subject">
            {SUBJECTS.map((subject) => (
              <SubjectButton
                key={subject}
                type="button"
                role="radio"
                aria-checked={state.previewSubject === subject}
                data-selected={state.previewSubject === subject ? "true" : undefined}
                onClick={() => actions.setPreviewSubject(subject)}
              >
                {subject[0].toUpperCase() + subject.slice(1)}
              </SubjectButton>
            ))}
          </SubjectRow>
        </FieldWrapper>

        {state.previewSubject === "image" ? (
          <FieldWrapper>
            <FieldLabel>Image</FieldLabel>
            <ImageOptionRow>
              {PREVIEW_IMAGES.map((id) => (
                <ImageOption
                  key={id}
                  type="button"
                  data-selected={state.previewImageId === id ? "true" : undefined}
                  aria-label={id}
                  onClick={() => actions.setPreviewImageId(id)}
                >
                  <img src={`/assets/img/${id}.png`} alt="" />
                </ImageOption>
              ))}
            </ImageOptionRow>
          </FieldWrapper>
        ) : (
          <FieldWrapper>
            <FieldLabel htmlFor="clip-path-color">Color</FieldLabel>
            <ColorInput id="clip-path-color" type="color" value={state.previewColor} onChange={(event) => actions.setPreviewColor(event.target.value)} />
          </FieldWrapper>
        )}

        {state.previewSubject === "text" && (
          <FieldWrapper>
            <FieldLabel htmlFor="clip-path-text">Text</FieldLabel>
            <TextInput id="clip-path-text" value={state.previewText} onChange={(event) => actions.setPreviewText(event.target.value)} maxLength={40} />
          </FieldWrapper>
        )}
      </FieldsColumn>
    </>
  );
}

ShapeControls.displayName = "ShapeControls";
