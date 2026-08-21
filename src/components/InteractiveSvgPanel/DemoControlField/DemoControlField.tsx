import type { JSX } from "react";
import type { DemoControlFieldProps } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.types";
import { resolveRangeMax } from "@/data/svg-demos";
import {
  FieldWrapper,
  FieldLabel,
  RangeRow,
  RangeEdge,
  RangeTrack,
  RangeBubble,
  RangeInput,
  ColorInput,
  SelectWrapper,
  SelectInput,
  CheckboxInput,
} from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";

/*
  Must match the thumb's inline-size in InteractiveSvgPanel.styles.ts — keeps the floating bubble centered
  over the thumb at every position, not just the track's raw percentage (the thumb is inset by half its own
  width at each end of a native range input).
*/
const THUMB_WIDTH = 16;

/*
  How many decimal places a step like 0.01 implies — used to round drag output back to that precision, since binary
  floating point can turn a clean step (e.g. 0.01 × 37) into something like 0.37000000000000005.
*/
function decimalPlacesOf(step: number): number {
  const decimalPart = step.toString().split(".")[1];
  return decimalPart?.length ?? 0;
}

// One form field for a single demo control — which input renders depends entirely on the control's own `type`.
export default function DemoControlField({ control, value, values, onChange }: DemoControlFieldProps): JSX.Element {
  switch (control.type) {
    case "range": {
      // `value` is guaranteed numeric here — see DemoControlFieldProps for why the cast is safe.
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
      // Rendered label-after-input (via [data-inline]) so the checkbox itself leads, matching native checkbox reading order.
      return (
        <>
          <FieldWrapper data-inline>
            <CheckboxInput
              id={control.id}
              type="checkbox"
              checked={value as boolean}
              onChange={(event) => onChange(control.id, event.target.checked)}
            />
            <FieldLabel htmlFor={control.id}>{control.label}</FieldLabel>
          </FieldWrapper>
        </>
      );
  }
}

DemoControlField.displayName = "DemoControlField";
