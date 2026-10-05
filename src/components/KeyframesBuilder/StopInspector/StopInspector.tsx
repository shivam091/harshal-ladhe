import type { JSX } from "react";
import { NUMERIC_PROPERTIES, TIMING_FUNCTIONS } from "@/utils/keyframes-builder";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput, CheckboxInput, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/KeyframesBuilder/Slider/Slider";
import { CelCard, PanelTitle, HelperText } from "@/components/KeyframesBuilder/KeyframesBuilder.styles";
import { InspectorHeader, RemoveButton, PropertyList, PropertyRow, PinLabel, ColorRow } from "@/components/KeyframesBuilder/StopInspector/StopInspector.styles";
import type { NumericPropertyMeta, StopInspectorProps } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// Sentinel <option> value for "no override" — a select can't hold null, and an empty string is unambiguous since no real timing function is blank.
const INHERIT_VALUE = "";

// Opacity reads as a percentage in the bubble (the CSS still gets 0–1); everything else shows its own unit.
function formatterFor(meta: NumericPropertyMeta): (value: number) => string {
  if (meta.key === "opacity") return (value) => `${Math.round(value * 100)}%`;
  if (meta.key === "scale") return (value) => `${value.toFixed(2)}×`;
  return (value) => `${Math.round(value)}${meta.unit === "deg" ? "°" : meta.unit}`;
}

/*
  Editor for the selected stop, styled as a cel laid over the sheet. Every property is opt-in: its
  checkbox pins it at this stop, and leaving it unchecked hands that property back to the browser to
  interpolate across from the neighbouring stops — which is the single most useful thing to
  understand about @keyframes, so the unpinned state says so in words.
*/
export default function StopInspector({ state, actions }: StopInspectorProps): JSX.Element {
  const stop = state.stops.find((candidate) => candidate.id === state.selectedStopId) ?? null;

  return (
    <>
      <CelCard aria-labelledby="keyframes-inspector-title">
        <InspectorHeader>
          <PanelTitle id="keyframes-inspector-title">{stop ? `Keyframe · ${stop.offset}%` : "Keyframe"}</PanelTitle>
          {stop && (
            <RemoveButton type="button" onClick={() => actions.removeStop(stop.id)} disabled={state.stops.length <= 1}>
              Remove
            </RemoveButton>
          )}
        </InspectorHeader>

        {!stop ? (
          <HelperText>Select a diamond on the exposure track to edit that keyframe.</HelperText>
        ) : (
          <>
            <Slider
              id="kfb-stop-offset"
              label="Offset"
              min={0}
              max={100}
              value={stop.offset}
              format={(value) => `${value}%`}
              onChange={(value) => actions.moveStop(stop.id, value)}
              onCommit={actions.commitDrag}
            />

            <PropertyList>
              {NUMERIC_PROPERTIES.map((meta) => {
                const value = stop.values[meta.key];
                const isPinned = value !== undefined;
                const checkboxId = `kfb-pin-${meta.key}`;
                return (
                  <PropertyRow key={meta.key} data-pinned={isPinned ? "true" : undefined}>
                    <PinLabel htmlFor={checkboxId}>
                      <CheckboxInput id={checkboxId} type="checkbox" checked={isPinned} onChange={(event) => actions.toggleStopProperty(stop.id, meta.key, event.target.checked)} />
                      <span>{meta.label}</span>
                      <span>{isPinned ? "pinned" : "interpolated"}</span>
                    </PinLabel>
                    {isPinned && (
                      <Slider
                        id={`kfb-value-${meta.key}`}
                        label={`${meta.label} value`}
                        min={meta.min}
                        max={meta.max}
                        step={meta.step}
                        value={value}
                        format={formatterFor(meta)}
                        onChange={(next) => actions.setStopValue(stop.id, meta.key, next)}
                        onCommit={actions.commitDrag}
                      />
                    )}
                  </PropertyRow>
                );
              })}

              <PropertyRow data-pinned={stop.values.backgroundColor !== undefined ? "true" : undefined}>
                <PinLabel htmlFor="kfb-pin-backgroundColor">
                  <CheckboxInput
                    id="kfb-pin-backgroundColor"
                    type="checkbox"
                    checked={stop.values.backgroundColor !== undefined}
                    onChange={(event) => actions.toggleStopProperty(stop.id, "backgroundColor", event.target.checked)}
                  />
                  <span>Background colour</span>
                  <span>{stop.values.backgroundColor !== undefined ? "pinned" : "interpolated"}</span>
                </PinLabel>
                {stop.values.backgroundColor !== undefined && (
                  <ColorRow>
                    <ColorInput
                      type="color"
                      aria-label="Background colour value"
                      value={stop.values.backgroundColor}
                      onChange={(event) => actions.setStopValue(stop.id, "backgroundColor", event.target.value)}
                      onBlur={actions.commitDrag}
                    />
                    <code>{stop.values.backgroundColor}</code>
                  </ColorRow>
                )}
              </PropertyRow>
            </PropertyList>

            <FieldWrapper>
              <FieldLabel htmlFor="kfb-stop-timing">Timing function to next keyframe</FieldLabel>
              <SelectWrapper>
                <SelectInput
                  id="kfb-stop-timing"
                  value={stop.timingFunction ?? INHERIT_VALUE}
                  onChange={(event) => actions.setStopTimingFunction(stop.id, event.target.value === INHERIT_VALUE ? null : event.target.value)}
                >
                  <option value={INHERIT_VALUE}>Inherit ({state.settings.timingFunction})</option>
                  {TIMING_FUNCTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectInput>
              </SelectWrapper>
            </FieldWrapper>
          </>
        )}
      </CelCard>
    </>
  );
}

StopInspector.displayName = "StopInspector";
