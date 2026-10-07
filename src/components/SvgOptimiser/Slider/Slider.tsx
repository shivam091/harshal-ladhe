import type { JSX } from "react";
import { FieldWrapper, FieldLabel, RangeRow, RangeEdge, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { SliderProps } from "@/components/SvgOptimiser/SvgOptimiser.types";

/*
  Slider wired to the undo stack's live/checkpoint split: every tick re-weighs the parcel without
  an undo entry, and release records one. Its own local copy rather than a cross-tool import, like
  every goodie's.
*/
export default function Slider({ id, label, min, max, value, suffix = "", onChange, onCommit }: SliderProps): JSX.Element {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const bubbleOffset = 8 - (percent / 100) * 16;

  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <RangeRow>
          <RangeEdge>{min}</RangeEdge>
          <RangeTrack>
            <RangeBubble style={{ left: `calc(${percent}% + ${bubbleOffset}px)` }}>
              {value}
              {suffix}
            </RangeBubble>
            <RangeInput
              id={id}
              type="range"
              min={min}
              max={max}
              step={1}
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
