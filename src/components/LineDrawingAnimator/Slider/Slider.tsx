import type { JSX } from "react";
import { FieldWrapper, FieldLabel, RangeRow, RangeEdge, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { SliderProps } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

/*
  Slider wired to this tool's live/checkpoint split: every drag tick calls onChange (no undo entry),
  release calls onCommit once. Its own local copy rather than a cross-tool import, like every
  goodie's, since each one's props differ slightly.
*/
export default function Slider({ id, label, min, max, value, step = 1, suffix = "", onChange, onCommit }: SliderProps): JSX.Element {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const bubbleOffset = 8 - (percent / 100) * 16;

  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <RangeRow>
          <RangeEdge>{min}</RangeEdge>
          <RangeTrack>
            <RangeBubble htmlFor={id} style={{ left: `calc(${percent}% + ${bubbleOffset}px)` }}>
              {Number(value.toFixed(2))}
              {suffix}
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
          <RangeEdge>{max}</RangeEdge>
        </RangeRow>
      </FieldWrapper>
    </>
  );
}

Slider.displayName = "Slider";
