import type { JSX } from "react";
import type { BlobFamily, FamilyControlsProps } from "@/interfaces/border-radius";
import { FieldWrapper, FieldLabel, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/BorderRadiusGenerator/Slider/Slider";
import { FamilyRow, FamilyButton } from "@/components/BorderRadiusGenerator/FamilyControls/FamilyControls.styles";

const FAMILIES: Array<{ id: BlobFamily; label: string }> = [
  { id: "rounded", label: "Rounded" },
  { id: "squircle", label: "Squircle" }
];

/*
  Shape family switcher plus the two fields that only make sense once a family is picked: the
  uniform-corners toggle (works for either family — it's about how many fields are editable, not
  how the corner is drawn) and the curvature exponent (squircle-only — a plain rounded corner has
  no Lamé exponent to speak of, it's always a circular/elliptical arc).
*/
export default function FamilyControls({ state, actions }: FamilyControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Shape</FieldLabel>
        <FamilyRow role="radiogroup" aria-label="Corner shape family">
          {FAMILIES.map((family) => (
            <FamilyButton
              key={family.id}
              type="button"
              role="radio"
              aria-checked={state.family === family.id}
              data-selected={state.family === family.id ? "true" : undefined}
              onClick={() => actions.setFamily(family.id)}
            >
              {family.label}
            </FamilyButton>
          ))}
        </FamilyRow>
      </FieldWrapper>

      <FieldWrapper data-inline="true">
        <FieldLabel htmlFor="blob-uniform">Uniform corners</FieldLabel>
        <CheckboxInput id="blob-uniform" type="checkbox" checked={state.uniform} onChange={(event) => actions.toggleUniform(event.target.checked)} />
      </FieldWrapper>

      {state.family === "squircle" && (
        <Slider label="Curvature" min={2} max={10} value={state.curvature} onChange={actions.setCurvature} onCommit={actions.commitDrag} />
      )}
    </>
  );
}

FamilyControls.displayName = "FamilyControls";
