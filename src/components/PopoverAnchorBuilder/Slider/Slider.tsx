import type { JSX } from "react";
import type { SliderProps } from "@/interfaces/popover-anchor-builder";
import { FieldWrapper, FieldLabel, RangeRow, RangeEdge, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";

// Slider wired to this tool's live/checkpoint split: every drag tick calls onChange (no undo entry — see useUndoStack's setPresent), release calls onCommit once. Its own local copy rather than a cross-tool import — every goodie owns its copy rather than reaching into another tool's folder (see TriangleGenerator's own Slider for the same reasoning).
export default function Slider({ label, min, max, value, suffix = "", onChange, onCommit, disabled = false }: SliderProps): JSX.Element {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const bubbleOffset = 8 - (percent / 100) * 16;

  return (
    <>
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <RangeRow>
          <RangeEdge>{min}</RangeEdge>
          <RangeTrack>
            <RangeBubble style={{ left: `calc(${percent}% + ${bubbleOffset}px)`, opacity: disabled ? 0.5 : 1 }}>
              {Math.round(value)}
              {suffix}
            </RangeBubble>
            <RangeInput
              type="range"
              min={min}
              max={max}
              value={value}
              disabled={disabled}
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
