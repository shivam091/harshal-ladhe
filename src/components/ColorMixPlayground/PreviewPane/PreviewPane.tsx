import type { JSX } from "react";
import { buildColorMixValue, buildRampGradient, SPACES } from "@/helpers/color-mix-editor";
import type { PreviewPaneProps } from "@/interfaces/color-mix";
import { PreviewStage, ResultSwatch, RampStage, RampLabel, CompareGrid, CompareRow, CompareLabel, CompareStrip } from "@/components/ColorMixPlayground/PreviewPane/PreviewPane.styles";

const SPACE_LABELS: Record<(typeof SPACES)[number], string> = {
  srgb: "sRGB",
  lab: "Lab",
  oklab: "OKLab",
  hsl: "HSL",
  hwb: "HWB",
  lch: "LCH",
  oklch: "OKLCH"
};

/*
  Three views of the same two colors: the big swatch is the actual color-mix() result at the
  current ratio (exactly what ExportPanel's code produces); the ramp strip is a full 0-100%
  linear-gradient in the selected space; the compare grid repeats that same ramp once per space
  (always at "shorter" hue, since presets/state don't carry a hue method per row) so the difference
  between, say, srgb's muddy midpoint and oklch's vivid one is visible without touching a control.
*/
export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  return (
    <>
      <PreviewStage>
        <ResultSwatch style={{ backgroundColor: buildColorMixValue(state) }} />
      </PreviewStage>

      <RampStage>
        <RampLabel>{SPACE_LABELS[state.space]} ramp, 0–100%</RampLabel>
        <CompareStrip style={{ backgroundImage: buildRampGradient(state.color1, state.color2, state.space, state.hueMethod) }} />
      </RampStage>

      <CompareGrid>
        <RampLabel>Compare across every space</RampLabel>
        {SPACES.map((space) => (
          <CompareRow key={space}>
            <CompareLabel>{SPACE_LABELS[space]}</CompareLabel>
            <CompareStrip style={{ backgroundImage: buildRampGradient(state.color1, state.color2, space, "shorter") }} />
          </CompareRow>
        ))}
      </CompareGrid>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
