import type { JSX } from "react";
import type { GradientType, TypeControlsProps } from "@/interfaces/gradient";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/GradientGenerator/GradientGenerator.styles";
import { TypeRow, TypeButton, RepeatingRow, RepeatingLabel, RepeatingToggle } from "@/components/GradientGenerator/TypeControls/TypeControls.styles";

// The three CSS gradient functions this editor can drive, in the order the radio group renders them.
const TYPES: Array<{ id: GradientType; label: string }> = [
  { id: "linear", label: "Linear" },
  { id: "radial", label: "Radial" },
  { id: "conic", label: "Conic" }
];

/*
  Gradient function switcher plus the repeating-gradient toggle — grouped together since both
  determine WHICH CSS gradient function the state compiles to, distinct from the geometry (angle/
  position) and color panels that follow it.
*/
export default function TypeControls({ state, actions }: TypeControlsProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Type</PanelTitle>
        </PanelHeader>
        <PanelBody>
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

          <RepeatingRow>
            <RepeatingLabel htmlFor="gradient-repeating">Repeating</RepeatingLabel>
            <RepeatingToggle
              id="gradient-repeating"
              type="checkbox"
              checked={state.repeating}
              onChange={(event) => actions.toggleRepeating(event.target.checked)}
            />
          </RepeatingRow>
        </PanelBody>
      </Panel>
    </>
  );
}

TypeControls.displayName = "TypeControls";
