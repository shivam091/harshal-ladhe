import type { JSX } from "react";
import { PlusIcon, TrashIcon, DuplicateIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { StepListProps } from "@/interfaces/fluid-type";
import { List, StepRow, StepButton, StepName, StepSummary, StepActions, IconButton, AddStepButton } from "@/components/FluidTypeCalculator/StepList/StepList.styles";

// The arbitrary list of scale steps (H1, H2, Body, …) — add/duplicate/remove/select, same shape as every other goodie's own item list. Remove is disabled rather than hidden once a single step remains, since a scale with zero steps has nothing left for the preview or export panel to show.
export default function StepList({ state, actions }: StepListProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Steps</FieldLabel>

        <List>
          {state.steps.map((step) => (
            <StepRow key={step.id}>
              <StepButton type="button" data-selected={state.selectedStepId === step.id ? "true" : undefined} onClick={() => actions.selectStep(step.id)}>
                <StepName>{step.name || "Untitled"}</StepName>
                <StepSummary>
                  {step.minSize}–{step.maxSize}px
                </StepSummary>
              </StepButton>

              <StepActions>
                <IconButton type="button" aria-label="Duplicate step" onClick={() => actions.duplicateStep(step.id)}>
                  <DuplicateIcon size={14} />
                </IconButton>
                <IconButton type="button" aria-label="Remove step" disabled={state.steps.length <= 1} onClick={() => actions.removeStep(step.id)}>
                  <TrashIcon size={14} />
                </IconButton>
              </StepActions>
            </StepRow>
          ))}
        </List>

        <AddStepButton type="button" onClick={actions.addStep}>
          <PlusIcon size={14} />
          Add step
        </AddStepButton>
      </FieldWrapper>
    </>
  );
}

StepList.displayName = "StepList";
