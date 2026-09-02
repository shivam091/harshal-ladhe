import type { JSX } from "react";
import type { PreviewSubject, TransitionControlsProps } from "@/interfaces/easing-curve-editor";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/EasingCurveEditor/Slider/Slider";
import { SubjectRow, SubjectButton } from "@/components/EasingCurveEditor/TransitionControls/TransitionControls.styles";

const PROPERTIES = ["all", "transform", "opacity", "background-color", "color", "border-color", "box-shadow", "width", "height"];
const SUBJECTS: Array<{ id: PreviewSubject; label: string }> = [
  { id: "slide", label: "Slide" },
  { id: "scale", label: "Scale" },
  { id: "opacity", label: "Opacity" },
  { id: "rotate", label: "Rotate" }
];

/*
  The fields a `transition` shorthand needs beyond the timing function itself (property, duration,
  delay) plus which preview subject demonstrates it — grouped together since every field here is
  about how the PREVIEW behaves, not the curve's own shape (that's CurveGraph's job).
*/
export default function TransitionControls({ state, actions }: TransitionControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Preview subject</FieldLabel>
        <SubjectRow role="radiogroup" aria-label="Preview subject">
          {SUBJECTS.map((subject) => (
            <SubjectButton
              key={subject.id}
              type="button"
              role="radio"
              aria-checked={state.previewSubject === subject.id}
              data-selected={state.previewSubject === subject.id ? "true" : undefined}
              onClick={() => actions.setPreviewSubject(subject.id)}
            >
              {subject.label}
            </SubjectButton>
          ))}
        </SubjectRow>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="easing-property">Property</FieldLabel>
        <SelectWrapper>
          <SelectInput id="easing-property" value={state.property} onChange={(event) => actions.setProperty(event.target.value)}>
            {PROPERTIES.map((property) => (
              <option key={property} value={property}>
                {property}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <Slider label="Duration" min={0} max={2000} value={state.durationMs} suffix="ms" onChange={actions.setDurationMs} onCommit={actions.commitDrag} />
      <Slider label="Delay" min={0} max={1000} value={state.delayMs} suffix="ms" onChange={actions.setDelayMs} onCommit={actions.commitDrag} />
    </>
  );
}

TransitionControls.displayName = "TransitionControls";
