import type { JSX } from "react";
import type { SurfaceControlsProps } from "@/interfaces/border-radius";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/BorderRadiusGenerator/Slider/Slider";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BorderRadiusGenerator/BorderRadiusGenerator.styles";
import { ColorPairRow } from "@/components/BorderRadiusGenerator/SurfaceControls/SurfaceControls.styles";

/*
  The clay's own color and the worktable it's resting on — split out from the corner controls since
  these apply to the whole lump, not to any one corner. `size` is also what RadiusOverlay's drag
  math and every corner's max-radius clamp are scaled against, so it lives here alongside the two
  colors rather than in CornerFields.
*/
export default function SurfaceControls({ state, actions }: SurfaceControlsProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Clay &amp; Worktable</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <ColorPairRow>
            <FieldWrapper>
              <FieldLabel htmlFor="blob-surface-color">Clay</FieldLabel>
              <ColorInput
                id="blob-surface-color"
                type="color"
                value={state.surfaceColor}
                onChange={(event) => actions.setSurfaceColor(event.target.value)}
                onBlur={actions.commitDrag}
              />
            </FieldWrapper>

            <FieldWrapper>
              <FieldLabel htmlFor="blob-page-color">Worktable</FieldLabel>
              <ColorInput id="blob-page-color" type="color" value={state.pageColor} onChange={(event) => actions.setPageColor(event.target.value)} onBlur={actions.commitDrag} />
            </FieldWrapper>
          </ColorPairRow>

          <Slider label="Size" min={80} max={320} value={state.size} suffix="px" onChange={actions.setSize} onCommit={actions.commitDrag} />
        </PanelBody>
      </Panel>
    </>
  );
}

SurfaceControls.displayName = "SurfaceControls";
