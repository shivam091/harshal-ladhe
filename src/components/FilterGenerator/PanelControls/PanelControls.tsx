import type { JSX } from "react";
import type { PanelControlsProps, PreviewSubject } from "@/interfaces/filter";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/FilterGenerator/Slider/Slider";
import { SubjectRow, SubjectButton, ImageOptionRow, ImageOption } from "@/components/FilterGenerator/PanelControls/PanelControls.styles";

const SUBJECTS: Array<{ id: PreviewSubject; label: string }> = [
  { id: "gradient", label: "Gradient" },
  { id: "photo", label: "Photo" }
];
const PREVIEW_IMAGES = ["hl-standing", "hl-sitting", "hl-smiling-face"];

/*
  What the preview shows (a vivid gradient reads saturate/hue-rotate/grayscale far more clearly than
  a photo, which is why it's the default — a real photo is there for a realistic case) plus, only
  for the backdropFilter target, the translucent panel's own tint — glassmorphism specifically
  depends on that panel being near-white/near-black and mostly transparent, so exposing it only
  where it's actually rendered (PreviewPane hides the panel entirely in "filter" mode) avoids a
  dead control.
*/
export default function PanelControls({ state, actions }: PanelControlsProps): JSX.Element {
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

      {state.previewSubject === "photo" && (
        <FieldWrapper>
          <FieldLabel>Photo</FieldLabel>
          <ImageOptionRow>
            {PREVIEW_IMAGES.map((id) => (
              <ImageOption key={id} type="button" data-selected={state.previewImageId === id ? "true" : undefined} aria-label={id} onClick={() => actions.setPreviewImageId(id)}>
                <img src={`/assets/img/${id}.png`} alt="" />
              </ImageOption>
            ))}
          </ImageOptionRow>
        </FieldWrapper>
      )}

      {state.target === "backdropFilter" && (
        <>
          <FieldWrapper>
            <FieldLabel htmlFor="filter-panel-color">Panel color</FieldLabel>
            <ColorInput
              id="filter-panel-color"
              type="color"
              value={state.panelColor}
              onChange={(event) => actions.setPanelColor(event.target.value)}
              onBlur={actions.commitDrag}
            />
          </FieldWrapper>
          <Slider label="Panel opacity" min={0} max={100} value={state.panelOpacity} suffix="%" onChange={actions.setPanelOpacity} onCommit={actions.commitDrag} />
        </>
      )}
    </>
  );
}

PanelControls.displayName = "PanelControls";
