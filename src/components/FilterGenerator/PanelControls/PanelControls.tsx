import type { JSX } from "react";
import Image from "next/image";
import type { PanelControlsProps, PreviewSubject } from "@/interfaces/filter";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/FilterGenerator/Slider/Slider";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/FilterGenerator/FilterGenerator.styles";
import { SubjectRow, SubjectButton, FilmStrip, Frame, Thumb, GelRow, GelCaption } from "@/components/FilterGenerator/PanelControls/PanelControls.styles";

// The two things the viewfinder can be pointed at.
const SUBJECTS: Array<{ id: PreviewSubject; label: string }> = [
  { id: "gradient", label: "Gradient" },
  { id: "photo", label: "Photo" }
];

// The site's own portrait photos, reused here as the tool's realistic preview case (same assets SiteHeader already renders).
const PREVIEW_IMAGES = ["hl-standing", "hl-sitting", "hl-smiling-face"];

/*
  What the viewfinder is pointed at (a vivid gradient reads saturate/hue-rotate/grayscale far more
  clearly than a photo, which is why it's the default) plus, only for the backdropFilter target, the
  translucent panel's own gel tint — glassmorphism specifically depends on that panel being
  near-white/near-black and mostly transparent, so exposing it only where it's actually rendered
  (PreviewPane hides the panel entirely in "filter" mode) avoids a dead control.
*/
export default function PanelControls({ state, actions }: PanelControlsProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Subject &amp; Panel</PanelTitle>
        </PanelHeader>
        <PanelBody>
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
              <FilmStrip>
                {PREVIEW_IMAGES.map((id) => (
                  <Frame
                    key={id}
                    type="button"
                    data-selected={state.previewImageId === id ? "true" : undefined}
                    aria-label={`Use ${id.replace(/-/g, " ")} photo`}
                    onClick={() => actions.setPreviewImageId(id)}
                  >
                    <Thumb>
                      <Image src={`/assets/img/${id}.png`} alt="" fill sizes="3rem" style={{ objectFit: "cover" }} />
                    </Thumb>
                  </Frame>
                ))}
              </FilmStrip>
            </FieldWrapper>
          )}

          {state.target === "backdropFilter" && (
            <GelRow>
              <FieldWrapper>
                <GelCaption>Panel gel</GelCaption>
                <FieldLabel htmlFor="filter-panel-color">Color</FieldLabel>
                <ColorInput
                  id="filter-panel-color"
                  type="color"
                  value={state.panelColor}
                  onChange={(event) => actions.setPanelColor(event.target.value)}
                  onBlur={actions.commitDrag}
                />
              </FieldWrapper>
              <Slider label="Opacity" min={0} max={100} value={state.panelOpacity} suffix="%" onChange={actions.setPanelOpacity} onCommit={actions.commitDrag} />
            </GelRow>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

PanelControls.displayName = "PanelControls";
