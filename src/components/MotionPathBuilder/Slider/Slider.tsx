import type { JSX } from "react";
import { RangeRow, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SliderField, SliderLabel, SliderEdge } from "@/components/MotionPathBuilder/Slider/Slider.styles";
import type { SliderProps } from "@/components/MotionPathBuilder/MotionPathBuilder.types";

/*
  Slider wired to the live/checkpoint split: every drag tick calls onChange (no undo entry) and
  release calls onCommit once. Reuses the shared range track and bubble, with its own label and
  edge styles that inherit colour, since half of these sit on the dark controller case.
*/
export default function Slider({ label, min, max, value, step = 1, decimals = 0, suffix = "", onChange, onCommit }: SliderProps): JSX.Element {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const bubbleOffset = 8 - (percent / 100) * 16;

  return (
    <>
      <SliderField>
        <SliderLabel>{label}</SliderLabel>
        <RangeRow>
          <SliderEdge>{min}</SliderEdge>
          <RangeTrack>
            <RangeBubble style={{ left: `calc(${percent}% + ${bubbleOffset}px)` }}>
              {value.toFixed(decimals)}
              {suffix}
            </RangeBubble>
            <RangeInput
              type="range"
              aria-label={label}
              aria-valuetext={`${value.toFixed(decimals)}${suffix}`}
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event) => onChange(event.target.valueAsNumber)}
              onPointerUp={onCommit}
              onKeyUp={onCommit}
            />
          </RangeTrack>
          <SliderEdge>{max}</SliderEdge>
        </RangeRow>
      </SliderField>
    </>
  );
}

Slider.displayName = "Slider";
