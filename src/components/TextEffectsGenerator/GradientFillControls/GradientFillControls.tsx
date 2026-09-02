import type { JSX } from "react";
import { PlusIcon, TrashIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/TextEffectsGenerator/Slider/Slider";
import type { GradientFillControlsProps, GradientFillType } from "@/interfaces/text-effects";
import { TypeRow, TypeButton, StopList, StopRow, StopColorInput, StopPositionInput, StopRemoveButton, AddStopButton } from "@/components/TextEffectsGenerator/GradientFillControls/GradientFillControls.styles";

const TYPES: Array<{ id: GradientFillType; label: string }> = [
  { id: "linear", label: "Linear" },
  { id: "radial", label: "Radial" },
  { id: "conic", label: "Conic" }
];

/*
  A deliberately simpler gradient editor than the standalone Gradient Generator's own StopEditor —
  plain color+position fields per stop rather than a draggable bar, and no color-space toggle or
  radial shape/size/position controls. A gradient read through narrow glyph strokes rarely benefits
  from that extra precision, so this tool doesn't pay for it in UI surface.
*/
export default function GradientFillControls({ state, actions }: GradientFillControlsProps): JSX.Element {
  const { gradientFill } = state;

  return (
    <>
      <FieldWrapper data-inline="true">
        <FieldLabel htmlFor="text-effects-gradient-enabled">Gradient fill</FieldLabel>
        <CheckboxInput id="text-effects-gradient-enabled" type="checkbox" checked={gradientFill.enabled} onChange={(event) => actions.toggleGradientFill(event.target.checked)} />
      </FieldWrapper>

      {gradientFill.enabled && (
        <>
          <FieldWrapper>
            <FieldLabel>Type</FieldLabel>
            <TypeRow role="radiogroup" aria-label="Gradient type">
              {TYPES.map((type) => (
                <TypeButton
                  key={type.id}
                  type="button"
                  role="radio"
                  aria-checked={gradientFill.type === type.id}
                  data-selected={gradientFill.type === type.id ? "true" : undefined}
                  onClick={() => actions.setGradientType(type.id)}
                >
                  {type.label}
                </TypeButton>
              ))}
            </TypeRow>
          </FieldWrapper>

          {gradientFill.type !== "radial" && (
            <Slider
              label={gradientFill.type === "linear" ? "Angle" : "Start angle"}
              min={0}
              max={359}
              value={gradientFill.angle}
              suffix="deg"
              onChange={actions.setGradientAngle}
              onCommit={actions.commitDrag}
            />
          )}

          <FieldWrapper>
            <FieldLabel>Stops</FieldLabel>
            <StopList>
              {gradientFill.stops.map((stop) => (
                <StopRow key={stop.id}>
                  <StopColorInput
                    type="color"
                    value={stop.color}
                    aria-label={`Stop color, ${Math.round(stop.position)}%`}
                    onChange={(event) => actions.updateGradientStop(stop.id, { color: event.target.value })}
                    onBlur={actions.commitDrag}
                  />
                  <StopPositionInput
                    type="number"
                    min={0}
                    max={100}
                    value={Math.round(stop.position)}
                    aria-label={`Stop position, ${stop.color}`}
                    onChange={(event) => actions.updateGradientStop(stop.id, { position: Number(event.target.value) })}
                    onBlur={actions.commitDrag}
                  />
                  <StopRemoveButton
                    type="button"
                    disabled={gradientFill.stops.length <= 2}
                    aria-label={`Remove ${stop.color} stop`}
                    onClick={() => actions.removeGradientStop(stop.id)}
                  >
                    <TrashIcon size={14} />
                  </StopRemoveButton>
                </StopRow>
              ))}
            </StopList>
            <AddStopButton type="button" onClick={actions.addGradientStop}>
              <PlusIcon size={14} />
              Add stop
            </AddStopButton>
          </FieldWrapper>
        </>
      )}
    </>
  );
}

GradientFillControls.displayName = "GradientFillControls";
