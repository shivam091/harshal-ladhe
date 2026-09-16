import type { JSX } from "react";
import { compileGradientValue } from "@/utils/gradient";
import type { PreviewPaneProps } from "@/interfaces/gradient";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/GradientGenerator/GradientGenerator.styles";
import { Stage, ValueReadout } from "@/components/GradientGenerator/PreviewPane/PreviewPane.styles";

/*
  The dedicated rectangle the live gradient actually renders into — sitting right below the
  undo/redo/reset toolbar and above every other control, including ExportPanel's own code block
  further down, so the result stays glanceable without the whole tool's own background doubling as
  the preview.
*/
export default function PreviewPane({ state }: PreviewPaneProps): JSX.Element {
  const cssValue = compileGradientValue(state);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Preview</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Stage style={{ background: cssValue }} />
          <ValueReadout title={cssValue}>{cssValue}</ValueReadout>
        </PanelBody>
      </Panel>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
