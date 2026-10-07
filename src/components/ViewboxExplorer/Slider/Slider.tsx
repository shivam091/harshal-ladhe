import type { JSX } from "react";
import type { SliderProps } from "@/components/ViewboxExplorer/ViewboxExplorer.types";
import { FieldWrapper, FieldLabel, RangeRow, RangeEdge, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";

/*
  Slider wired to this tool's live/checkpoint split: every drag tick calls onChange (no undo entry),
  release calls onCommit once. Its own local copy rather than a cross-tool import, like every
  goodie's.
*/
export default function Slider({ label, min, max, value, step = 1, suffix = "", onChange, onCommit }: SliderProps): JSX.Element {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const bubbleOffset = 8 - (percent / 100) * 16;

  return (
    <>
      <FieldWrapper>
        <FieldLabel as="span">{label}</FieldLabel>
        <RangeRow>
          <RangeEdge>{min}</RangeEdge>
          <RangeTrack>
            <RangeBubble style={{ left: `calc(${percent}% + ${bubbleOffset}px)` }}>
              {Math.round(value)}
              {suffix}
            </RangeBubble>
            <RangeInput
              type="range"
              aria-label={label}
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
