"use client";

import { useId, useState } from "react";
import type { JSX } from "react";
import { renderSvgTree } from "@/utils/svg-to-react-render";
import { FieldWrapper, FieldLabel, ColorInput, RangeRow, RangeEdge, RangeTrack, RangeBubble, RangeInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SectionCard, PanelTitle, HintText } from "@/components/SvgToReactConverter/SvgToReactConverter.styles";
import { ControlRow, StageGrid, Stage, StageCaption, StageCanvas } from "@/components/SvgToReactConverter/PreviewPane/PreviewPane.styles";
import type { PreviewPaneProps, SliderProps } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// A tint nothing in the presets already uses, so the moment a colour becomes currentColor the change is unmistakable.
const DEFAULT_TINT = "#e11d48";
const DEFAULT_SIZE = 96;

// The shared range-slider skeleton, without the undo-stack commit — preview size is a viewing aid, not part of the conversion.
function Slider({ id, label, min, max, value, suffix = "", onChange }: SliderProps): JSX.Element {
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
              {Math.round(value)}
              {suffix}
            </RangeBubble>
            <RangeInput id={id} type="range" min={min} max={max} value={value} onChange={(event) => onChange(event.target.valueAsNumber)} />
          </RangeTrack>
          <RangeEdge>{max}</RangeEdge>
        </RangeRow>
      </FieldWrapper>
    </>
  );
}

Slider.displayName = "Slider";

/*
  Original and converted artwork side by side, both rendered from the pipeline's sanitised trees
  as real React elements. The tint sets the stages' CSS `color`, so anything rewritten to
  currentColor visibly follows it while the original keeps its baked-in colours. Each stage gets
  its own id prefix so duplicated gradient/mask ids don't resolve to the other stage's copy.
*/
export default function PreviewPane({ result }: PreviewPaneProps): JSX.Element {
  const [tint, setTint] = useState(DEFAULT_TINT);
  const [size, setSize] = useState(DEFAULT_SIZE);
  const prefix = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const stageStyle = { color: tint };

  return (
    <>
      <SectionCard>
        <PanelTitle data-designator="U2">Preview</PanelTitle>
        <ControlRow>
          <FieldWrapper>
            <FieldLabel htmlFor={`${prefix}-tint`}>Text colour (currentColor)</FieldLabel>
            <ColorInput id={`${prefix}-tint`} type="color" value={tint} onChange={(event) => setTint(event.target.value)} />
          </FieldWrapper>
          <Slider id={`${prefix}-size`} label="Converted size" min={16} max={256} value={size} suffix="px" onChange={setSize} />
        </ControlRow>

        {result.original && result.converted ? (
          <StageGrid>
            <Stage>
              <StageCaption>Original</StageCaption>
              <StageCanvas style={stageStyle} data-stage="original" role="img" aria-label="Original SVG preview">
                {renderSvgTree(result.original, { idPrefix: `${prefix}-o-` })}
              </StageCanvas>
            </Stage>
            <Stage>
              <StageCaption>Converted · {size}px</StageCaption>
              <StageCanvas style={stageStyle} data-stage="converted" role="img" aria-label={`Converted ${result.componentName} preview`}>
                {renderSvgTree(result.converted, { idPrefix: `${prefix}-c-`, rootProps: { width: size, height: size } })}
              </StageCanvas>
            </Stage>
          </StageGrid>
        ) : (
          <HintText>Nothing to preview until the SVG parses.</HintText>
        )}
      </SectionCard>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
