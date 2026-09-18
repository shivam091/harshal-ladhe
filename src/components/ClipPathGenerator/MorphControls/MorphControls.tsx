"use client";

import { useState } from "react";
import type { JSX } from "react";
import { shapesAreTopologyCompatible, toKeyframesBlock, toTransitionDeclaration } from "@/utils/clip-path-animation";
import { generateRandomPolygon, clipPathPresets } from "@/data/clip-path-presets";
import { useHighlightedCode } from "@/hooks/use-highlighted-code";
import CopyButton from "@/components/CopyButton";
import Shimmer from "@/components/Shimmer";
import { CodeBlockWrapper, Pre } from "@/components/CodeBlock/CodeBlock.styles";
import {
  FieldWrapper,
  FieldLabel,
  RangeRow,
  RangeEdge,
  RangeTrack,
  RangeBubble,
  RangeInput,
  SelectWrapper,
  SelectInput,
  CheckboxInput
} from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { TextInput } from "@/components/ClipPathGenerator/ShapeControls/ShapeControls.styles";
import { SectionCard, PanelTitle } from "@/components/ClipPathGenerator/ClipPathGenerator.styles";
import { ToggleRow, ButtonRow, SmallButton, IncompatibleNotice } from "@/components/ClipPathGenerator/MorphControls/MorphControls.styles";
import type { MorphControlsProps } from "@/interfaces/clip-path";

const EASINGS = [
  { label: "Ease in-out", value: "cubic-bezier(0.65, 0, 0.35, 1)" },
  { label: "Ease out (back)", value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  { label: "Linear", value: "linear" },
  { label: "Ease", value: "ease" }
];

/*
  Two-state morph — define Shape B (via a preset or Shuffle, then "Sync topology" if needed), scrub
  between A and B for a live preview, and export a ready @keyframes + transition pair. Most free
  clip-path tools have no morph feature at all; this one leans on shapesAreTopologyCompatible to
  keep the exported CSS's native browser interpolation actually smooth rather than a silent jump-cut.
*/
export default function MorphControls({ state, actions }: MorphControlsProps): JSX.Element {
  const [copyTrigger, setCopyTrigger] = useState(0);
  const { morph } = state;
  const compatible = morph ? shapesAreTopologyCompatible(state.shape, morph.shapeB) : true;
  const keyframesCode = morph ? `${toKeyframesBlock("clipMorph", state.shape, morph.shapeB)}\n\n.clip-morph {\n  ${toTransitionDeclaration(morph.duration, morph.easing)}\n}` : "";
  const html = useHighlightedCode(keyframesCode, "css");

  return (
    <>
      <SectionCard>
        <PanelTitle>Morph</PanelTitle>
        <ToggleRow>
          <CheckboxInput type="checkbox" checked={morph?.enabled ?? false} onChange={(event) => actions.toggleMorph(event.target.checked)} />
          Animate to a second shape
        </ToggleRow>

        {morph?.enabled && (
          <>
            <FieldWrapper>
              <FieldLabel htmlFor="clip-path-morph-preset">Shape B preset</FieldLabel>
              <SelectWrapper>
                <SelectInput
                  id="clip-path-morph-preset"
                  defaultValue=""
                  onChange={(event) => {
                    const preset = clipPathPresets.find((p) => p.slug === event.target.value);
                    if (preset) actions.setMorphShapeB(preset.shape);
                  }}
                >
                  <option value="" disabled>
                    Choose a preset…
                  </option>
                  {clipPathPresets.map((preset) => (
                    <option key={preset.slug} value={preset.slug}>
                      {preset.name}
                    </option>
                  ))}
                </SelectInput>
              </SelectWrapper>
            </FieldWrapper>

            <ButtonRow>
              <SmallButton type="button" onClick={() => actions.setMorphShapeB(generateRandomPolygon())}>
                Shuffle Shape B
              </SmallButton>
              <SmallButton type="button" disabled={compatible} onClick={actions.syncMorphTopology}>
                Sync topology
              </SmallButton>
            </ButtonRow>

            {!compatible && (
              <IncompatibleNotice>
                Shape B doesn&rsquo;t match Shape A&rsquo;s point structure yet — animating will jump-cut instead of morphing until you sync it.
              </IncompatibleNotice>
            )}

            <FieldWrapper>
              <FieldLabel htmlFor="clip-path-morph-scrub">Preview scrub</FieldLabel>
              <RangeRow>
                <RangeEdge>A</RangeEdge>
                <RangeTrack>
                  <RangeBubble style={{ left: `calc(${morph.t * 100}% + ${8 - morph.t * 16}px)` }}>{Math.round(morph.t * 100)}%</RangeBubble>
                  <RangeInput type="range" min={0} max={1} step={0.01} value={morph.t} onChange={(event) => actions.setMorphT(event.target.valueAsNumber)} />
                </RangeTrack>
                <RangeEdge>B</RangeEdge>
              </RangeRow>
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel htmlFor="clip-path-morph-duration">Duration</FieldLabel>
              <TextInput id="clip-path-morph-duration" value={morph.duration} onChange={(event) => actions.setMorphDuration(event.target.value)} />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel htmlFor="clip-path-morph-easing">Easing</FieldLabel>
              <SelectWrapper>
                <SelectInput id="clip-path-morph-easing" value={morph.easing} onChange={(event) => actions.setMorphEasing(event.target.value)}>
                  {EASINGS.map((easing) => (
                    <option key={easing.value} value={easing.value}>
                      {easing.label}
                    </option>
                  ))}
                </SelectInput>
              </SelectWrapper>
            </FieldWrapper>

            <CodeBlockWrapper>
              <CopyButton code={keyframesCode} onCopy={() => setCopyTrigger((prev) => prev + 1)} />
              <Pre tabIndex={0} role="region" aria-label="Generated animation code" data-has-copy-button dangerouslySetInnerHTML={{ __html: html }} />
              <Shimmer trigger={copyTrigger} />
            </CodeBlockWrapper>
          </>
        )}
      </SectionCard>
    </>
  );
}

MorphControls.displayName = "MorphControls";
