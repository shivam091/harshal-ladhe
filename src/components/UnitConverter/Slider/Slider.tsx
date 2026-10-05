import { useId } from "react";
import type { JSX } from "react";
import type { SliderProps } from "@/components/UnitConverter/UnitConverter.types";
import { FieldWrapper, FieldLabel, RangeRow, RangeEdge, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";

// Slider wired to this tool's live/checkpoint split: every drag tick calls onChange (no undo entry — see useUndoStack's setPresent), release calls onCommit once. Its own local copy rather than a cross-tool import — every goodie owns its copy rather than reaching into another tool's folder.
export default function Slider({ label, min, max, value, step = 1, suffix = "", onChange, onCommit }: SliderProps): JSX.Element {
  const id = useId();
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
              {step < 1 ? value : Math.round(value)}
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
