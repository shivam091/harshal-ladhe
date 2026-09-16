import type { JSX } from "react";
import type { SliderProps } from "@/interfaces/layout-playground";
import { FieldWrapper, FieldLabel, RangeRow, RangeEdge, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";

/*
  Slider wired to this tool's live/checkpoint split: every drag tick calls onChange (no undo entry
  — see useUndoStack's setPresent), release calls onCommit once. Its own local copy rather than a
  cross-tool import — every goodie owns its copy rather than reaching into another tool's folder —
  reusing the shared DemoControlField range primitive as-is so every slider on the site keeps the
  same track/thumb/bubble chrome regardless of which tool it lives in.
*/
export default function Slider({ label, min, max, value, suffix = "", onChange, onCommit }: SliderProps): JSX.Element {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const bubbleOffset = 8 - (percent / 100) * 16;

  return (
    <>
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <RangeRow>
          <RangeEdge>{min}</RangeEdge>
          <RangeTrack>
            <RangeBubble style={{ left: `calc(${percent}% + ${bubbleOffset}px)` }}>
              {Math.round(value * 100) / 100}
              {suffix}
            </RangeBubble>
            <RangeInput
              type="range"
              min={min}
              max={max}
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
