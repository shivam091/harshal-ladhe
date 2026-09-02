import type { JSX } from "react";
import { compileClampValue, computeClampParts } from "@/utils/fluid-type";
import type { StepControlsProps } from "@/interfaces/fluid-type";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/FluidTypeCalculator/Slider/Slider";
import { TextInput, ClampPreview } from "@/components/FluidTypeCalculator/StepControls/StepControls.styles";

// Fields for whichever step StepList currently has selected — name, and its size at each end of the viewport range. Reads as its own panel (rather than inline in StepList) since every other goodie splits "pick an item" from "edit the picked item" the same way.
export default function StepControls({ state, actions }: StepControlsProps): JSX.Element {
  const step = state.steps.find((s) => s.id === state.selectedStepId) ?? state.steps[0];
  if (!step) return <></>;

  const clampValue = compileClampValue(computeClampParts(step, state.minViewport, state.maxViewport, state.rootFontSize));

  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor="fluid-type-step-name">Name</FieldLabel>
        <TextInput
          id="fluid-type-step-name"
          value={step.name}
          onChange={(event) => actions.updateStep(step.id, { name: event.target.value })}
          onBlur={actions.commitDrag}
          maxLength={24}
        />
      </FieldWrapper>

      <Slider label={`Size at ${state.minViewport}px`} min={8} max={300} value={step.minSize} suffix="px" onChange={(size) => actions.updateStep(step.id, { minSize: size })} onCommit={actions.commitDrag} />
      <Slider label={`Size at ${state.maxViewport}px`} min={8} max={300} value={step.maxSize} suffix="px" onChange={(size) => actions.updateStep(step.id, { maxSize: size })} onCommit={actions.commitDrag} />

      <FieldWrapper>
        <FieldLabel>Computed clamp()</FieldLabel>
        <ClampPreview>{clampValue}</ClampPreview>
      </FieldWrapper>
    </>
  );
}

StepControls.displayName = "StepControls";
