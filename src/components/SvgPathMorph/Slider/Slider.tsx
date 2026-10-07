import type { JSX } from "react";
import { FieldWrapper, FieldLabel, RangeRow, RangeEdge, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { SliderProps } from "@/components/SvgPathMorph/SvgPathMorph.types";

// Fallback bubble formatting — whole numbers for whole-number steps, two decimals otherwise.
function defaultFormat(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

/*
  Slider wired to the bench's live/checkpoint split: every drag tick calls onChange (no undo
  entry), release calls onCommit once. The tool's own copy rather than a cross-goodie import, as
  every goodie owns its slider.
*/
export default function Slider({ id, label, min, max, step = 1, value, format = defaultFormat, onChange, onCommit }: SliderProps): JSX.Element {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const bubbleOffset = 8 - (percent / 100) * 16;

  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <RangeRow>
          <RangeEdge>{format(min)}</RangeEdge>
          <RangeTrack>
            <RangeBubble htmlFor={id} style={{ left: `calc(${percent}% + ${bubbleOffset}px)` }}>
              {format(value)}
            </RangeBubble>
            <RangeInput
              id={id}
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event) => onChange(event.target.valueAsNumber)}
              onPointerUp={onCommit}
              onKeyUp={onCommit}
            />
          </RangeTrack>
          <RangeEdge>{format(max)}</RangeEdge>
        </RangeRow>
      </FieldWrapper>
    </>
  );
}

Slider.displayName = "Slider";
