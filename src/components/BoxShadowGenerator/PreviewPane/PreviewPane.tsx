import type { JSX } from "react";
import { compileBoxShadowValue } from "@/utils/box-shadow";
import type { PreviewPaneProps } from "@/interfaces/box-shadow";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BoxShadowGenerator/BoxShadowGenerator.styles";
import { PreviewStage, GroundShadow, Swatch } from "@/components/BoxShadowGenerator/PreviewPane/PreviewPane.styles";

/*
  The tool's other flagship flourish: the swatch never floats in empty space. GroundShadow bakes a
  fixed ambient contact shadow into the stage itself, independent of whatever the user has
  configured, so the surface always reads as physically resting on something — the user's own
  compiled shadow (compileBoxShadowValue) then renders directly on the swatch, on top of that
  baseline, and is clearly the "added" effect rather than the only thing keeping the swatch grounded.
*/
export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Preview</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <PreviewStage style={{ background: state.pageColor }}>
            <GroundShadow aria-hidden="true" />
            <Swatch style={{ background: state.surfaceColor, borderRadius: `${state.borderRadius}px`, boxShadow: compileBoxShadowValue(state) }} />
          </PreviewStage>
        </PanelBody>
      </Panel>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
