import type { JSX } from "react";
import type { DemoControlFieldProps } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.types";
import { resolveRangeMax } from "@/data/svg-demos";
import {
  FieldWrapper,
  FieldLabel,
  FieldLabelSpacer,
  CheckboxRow,
  RangeRow,
  RangeEdge,
  RangeTrack,
  RangeBubble,
  RangeInput,
  ColorInput,
  SelectWrapper,
  SelectInput,
  CheckboxInput
} from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";

/*
  Must match RangeInput's 1rem thumb so the bubble stays centred over it; a native thumb is inset by half
  its width at each end, so the track's raw percentage alone would drift.
*/
const THUMB_WIDTH = 16;

// Rounds drag output to the step's precision, since floating point turns 0.01 × 37 into 0.37000000000000005.
function decimalPlacesOf(step: number): number {
  const decimalPart = step.toString().split(".")[1];
  return decimalPart?.length ?? 0;
}

// One field per control type so every demo's toolbar looks the same without per-demo markup.
export default function DemoControlField({ control, value, values, onChange }: DemoControlFieldProps): JSX.Element {
  switch (control.type) {
    case "range": {
      // Safe cast: `value` comes from the same registry entry as the control's type, so it's numeric here.
      const max = resolveRangeMax(control, values);
      /*
        A dynamic max can momentarily equal `min` (e.g. width shrunk to its own floor) — guard the divide so
        the bubble doesn't fly off to NaN%.
      */
      const percent = max > control.min ? ((Number(value) - control.min) / (max - control.min)) * 100 : 0;
      const bubbleOffset = THUMB_WIDTH / 2 - (percent / 100) * THUMB_WIDTH;
      const step = control.step ?? 1;

      return (
        <>
          <FieldWrapper>
            <FieldLabel htmlFor={control.id}>{control.label}</FieldLabel>
            <RangeRow>
              <RangeEdge>{control.min}</RangeEdge>
              <RangeTrack>
                <RangeBubble htmlFor={control.id} style={{ left: `calc(${percent}% + ${bubbleOffset}px)` }}>
                  {String(value)}
                </RangeBubble>
                <RangeInput
                  id={control.id}
                  type="range"
                  min={control.min}
                  max={max}
                  step={step}
                  value={value as number}
                  onChange={(event) => {
                    const raw = event.target.valueAsNumber;
                    const rounded = typeof step === "number" ? Number(raw.toFixed(decimalPlacesOf(step))) : raw;
                    onChange(control.id, rounded);
                  }}
                />
              </RangeTrack>
              <RangeEdge>{max}</RangeEdge>
            </RangeRow>
          </FieldWrapper>
        </>
      );
    }

    case "color":
      return (
        <>
          <FieldWrapper>
            <FieldLabel htmlFor={control.id}>{control.label}</FieldLabel>
            <ColorInput
              id={control.id}
              type="color"
              value={value as string}
              onChange={(event) => onChange(control.id, event.target.value)}
            />
          </FieldWrapper>
        </>
      );

    case "select":
      return (
        <>
          <FieldWrapper>
            <FieldLabel htmlFor={control.id}>{control.label}</FieldLabel>
            <SelectWrapper>
              <SelectInput
                id={control.id}
                value={value as string}
                onChange={(event) => onChange(control.id, event.target.value)}
              >
                {control.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
        </>
      );

    case "checkbox":
      // Rendered label-after-input (checkbox leads in the DOM, matching native checkbox reading order).
      return (
        <>
          <FieldWrapper>
            <FieldLabelSpacer aria-hidden="true">{control.label}</FieldLabelSpacer>
            <CheckboxRow>
              <CheckboxInput
                id={control.id}
                type="checkbox"
                checked={value as boolean}
                onChange={(event) => onChange(control.id, event.target.checked)}
              />
              <FieldLabel htmlFor={control.id}>{control.label}</FieldLabel>
            </CheckboxRow>
          </FieldWrapper>
        </>
      );
  }
}

DemoControlField.displayName = "DemoControlField";
