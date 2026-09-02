import type { JSX } from "react";
import type { GradientType, TypeControlsProps } from "@/interfaces/gradient";
import { FieldWrapper, FieldLabel, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { TypeRow, TypeButton } from "@/components/GradientGenerator/TypeControls/TypeControls.styles";

const TYPES: Array<{ id: GradientType; label: string }> = [
  { id: "linear", label: "Linear" },
  { id: "radial", label: "Radial" },
  { id: "conic", label: "Conic" }
];

// Gradient function switcher plus the repeating-gradient toggle — grouped together since both are "which CSS gradient function this compiles to," distinct from the geometry (angle/position) and color concerns that live in their own panels.
export default function TypeControls({ state, actions }: TypeControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Type</FieldLabel>
        <TypeRow role="radiogroup" aria-label="Gradient type">
          {TYPES.map((type) => (
            <TypeButton
              key={type.id}
              type="button"
              role="radio"
              aria-checked={state.config.type === type.id}
              data-selected={state.config.type === type.id ? "true" : undefined}
              onClick={() => actions.setType(type.id)}
            >
              {type.label}
            </TypeButton>
          ))}
        </TypeRow>
      </FieldWrapper>

      <FieldWrapper data-inline="true">
        <FieldLabel htmlFor="gradient-repeating">Repeating</FieldLabel>
        <CheckboxInput
          id="gradient-repeating"
          type="checkbox"
          checked={state.repeating}
          onChange={(event) => actions.toggleRepeating(event.target.checked)}
        />
      </FieldWrapper>
    </>
  );
}

TypeControls.displayName = "TypeControls";
