import type { JSX } from "react";
import { compileFilterValue } from "@/utils/filter";
import type { PreviewPaneProps } from "@/interfaces/filter";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/FilterGenerator/FilterGenerator.styles";
import { ViewfinderFrame, Stage, TestChart, GlassPanel, Bracket, ExposureReadout } from "@/components/FilterGenerator/PreviewPane/PreviewPane.styles";

// A fixed, vivid multi-hue gradient — reads saturate/hue-rotate/grayscale/invert far more clearly than a flat color or a muted photo would, which is the point of defaulting to it over the site's own (comparatively low-saturation) portrait photos.
const REFERENCE_GRADIENT = "linear-gradient(135deg, #f97316 0%, #ec4899 33%, #8b5cf6 66%, #06b6d4 100%)";

// Counts how many lenses are currently in the light path — every enabled filter function plus drop-shadow if it's on — for the viewfinder's own exposure-style HUD readout.
function activeLensCount(state: PreviewPaneProps["state"]): number {
  const activeFunctions = Object.values(state.functions).filter((fn) => fn.enabled).length;
  return activeFunctions + (state.dropShadow.enabled ? 1 : 0);
}

/*
  The tool's other flagship flourish: the preview subject sits inside a camera-viewfinder frame —
  sharp autofocus-style corner brackets and a small exposure readout, both unaffected by whatever
  filter is currently applied (see Bracket/ExposureReadout's own comments). In backdropFilter mode,
  the stage renders a busy calibration-chart backdrop through a translucent panel rather than
  filtering a flat swatch, so the effect is something the eye can actually track.
*/
export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  const backgroundImage = state.previewSubject === "gradient" ? REFERENCE_GRADIENT : `url(/assets/img/${state.previewImageId}.png)`;
  const value = compileFilterValue(state);
  const isBackdrop = state.target === "backdropFilter";

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Viewfinder</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <ViewfinderFrame>
            <Stage style={{ backgroundImage, filter: isBackdrop ? "none" : value }}>
              {isBackdrop && <TestChart aria-hidden="true" />}
              {isBackdrop && (
                <GlassPanel style={{ backdropFilter: value, background: `color-mix(in srgb, ${state.panelColor} ${state.panelOpacity}%, transparent)` }} />
              )}
            </Stage>
            <Bracket aria-hidden="true" data-corner="tl" />
            <Bracket aria-hidden="true" data-corner="tr" />
            <Bracket aria-hidden="true" data-corner="bl" />
            <Bracket aria-hidden="true" data-corner="br" />
            <ExposureReadout aria-hidden="true">
              {isBackdrop ? "BACKDROP" : "FILTER"} · {activeLensCount(state)} IN PATH
            </ExposureReadout>
          </ViewfinderFrame>
        </PanelBody>
      </Panel>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
