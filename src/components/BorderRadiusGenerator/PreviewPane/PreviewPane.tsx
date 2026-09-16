import type { JSX } from "react";
import { compileBlobValue } from "@/utils/border-radius";
import RadiusOverlay from "@/components/BorderRadiusGenerator/RadiusOverlay/RadiusOverlay";
import type { PreviewPaneProps } from "@/interfaces/border-radius";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BorderRadiusGenerator/BorderRadiusGenerator.styles";
import { WorkSurface, ClayLump } from "@/components/BorderRadiusGenerator/PreviewPane/PreviewPane.styles";

/*
  The tool's flagship flourish: the shape under edit sits on a worktable as a physical lump of clay
  — see ClayLump's own comment for how its drop-shadow keeps hugging the true silhouette across both
  families — with RadiusOverlay's pinch-point handles layered directly on top of it. Applies
  whichever CSS property the current family actually compiles to (border-radius or clip-path) —
  never both at once, since a leftover clip-path from a previous squircle edit would otherwise
  silently clip a "rounded" family's square corners.
*/
export default function PreviewPane({ state, actions }: PreviewPaneProps): JSX.Element {
  const { property, value } = compileBlobValue(state);
  const lumpStyle = { background: state.surfaceColor, borderRadius: property === "border-radius" ? value : "0", clipPath: property === "clip-path" ? value : "none" };

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Work Surface</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <WorkSurface style={{ background: state.pageColor }}>
            <ClayLump style={lumpStyle}>
              <RadiusOverlay state={state} actions={actions} />
            </ClayLump>
          </WorkSurface>
        </PanelBody>
      </Panel>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
