import type { JSX } from "react";
import { normalize } from "@/utils/number";
import { computeSizeAtWidth } from "@/utils/fluid-type";
import type { PreviewPaneProps } from "@/interfaces/fluid-type";
import Slider from "@/components/FluidTypeCalculator/Slider/Slider";
import { PreviewStage, ScrubberReadout, ScaledViewport, StepRow, StepMeta, StepSample } from "@/components/FluidTypeCalculator/PreviewPane/PreviewPane.styles";

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";
// How narrow the scaled viewport box is allowed to visually shrink to at previewWidth === minViewport — never all the way to 0%, so the box (and its text) stays legible even at the tool's own smallest simulated width.
const MIN_STAGE_PERCENT = 32;

/*
  A live "as-if browser window": dragging the width slider recomputes every step's size via
  computeSizeAtWidth (the same linear interpolation clamp() performs) and visually resizes the
  scaled box to match — a plain element has no way to resolve `vw` against anything but the real
  window, so this simulates the effect in JS instead of relying on actual CSS clamp() here.
*/
export default function PreviewPane({ state, actions }: PreviewPaneProps): JSX.Element {
  const stagePercent = normalize(state.previewWidth, state.minViewport, state.maxViewport, MIN_STAGE_PERCENT, 100);

  return (
    <>
      <PreviewStage style={{ background: state.pageColor }}>
        <Slider label="Preview viewport width" min={state.minViewport} max={state.maxViewport} value={state.previewWidth} suffix="px" onChange={(px) => actions.setPreviewWidth(px)} onCommit={actions.commitDrag} />
        <ScrubberReadout>Simulating a {Math.round(state.previewWidth)}px-wide viewport</ScrubberReadout>

        <ScaledViewport style={{ inlineSize: `${stagePercent}%` }}>
          {state.steps.map((step) => {
            const size = computeSizeAtWidth(step, state.minViewport, state.maxViewport, state.previewWidth);
            return (
              <StepRow key={step.id}>
                <StepMeta>
                  {step.name || "Untitled"} — {Math.round(size)}px ({(size / state.rootFontSize).toFixed(2)}rem)
                </StepMeta>
                <StepSample style={{ fontSize: `${size}px` }}>{SAMPLE_TEXT}</StepSample>
              </StepRow>
            );
          })}
        </ScaledViewport>
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
