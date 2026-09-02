import type { JSX } from "react";
import type { FilterTarget, TargetControlsProps } from "@/interfaces/filter";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { TargetRow, TargetButton, HelperText } from "@/components/FilterGenerator/TargetControls/TargetControls.styles";

const TARGETS: Array<{ id: FilterTarget; label: string }> = [
  { id: "filter", label: "Filter" },
  { id: "backdropFilter", label: "Backdrop-Filter" }
];

// Which CSS property every enabled function compiles onto — "Filter" processes the preview subject itself; "Backdrop-Filter" processes whatever sits behind a translucent panel, which is what PreviewPane swaps to show and what unlocks PanelControls below.
export default function TargetControls({ state, actions }: TargetControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Target</FieldLabel>
        <TargetRow role="radiogroup" aria-label="Filter target property">
          {TARGETS.map((target) => (
            <TargetButton
              key={target.id}
              type="button"
              role="radio"
              aria-checked={state.target === target.id}
              data-selected={state.target === target.id ? "true" : undefined}
              onClick={() => actions.setTarget(target.id)}
            >
              {target.label}
            </TargetButton>
          ))}
        </TargetRow>
        <HelperText>
          {state.target === "filter"
            ? "Processes the preview subject itself."
            : "Processes whatever sits behind a translucent panel — the effect glassmorphism relies on."}
        </HelperText>
      </FieldWrapper>
    </>
  );
}

TargetControls.displayName = "TargetControls";
