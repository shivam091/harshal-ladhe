import type { JSX } from "react";
import { compileBlobValue } from "@/utils/border-radius";
import RadiusOverlay from "@/components/BorderRadiusGenerator/RadiusOverlay/RadiusOverlay";
import type { PreviewPaneProps } from "@/interfaces/border-radius";
import { PreviewStage, Swatch } from "@/components/BorderRadiusGenerator/PreviewPane/PreviewPane.styles";

// Applies whichever CSS property the current family actually compiles to (border-radius or clip-path) — never both at once, since a leftover clip-path from a previous squircle edit would otherwise silently clip a "rounded" family's square corners.
export default function PreviewPane({ state, actions }: PreviewPaneProps): JSX.Element {
  const { property, value } = compileBlobValue(state);
  const swatchStyle = { background: state.surfaceColor, borderRadius: property === "border-radius" ? value : "0", clipPath: property === "clip-path" ? value : "none" };

  return (
    <>
      <PreviewStage style={{ background: state.pageColor }}>
        <Swatch style={swatchStyle}>
          <RadiusOverlay state={state} actions={actions} />
        </Swatch>
      </PreviewStage>
    </>
  );
}

PreviewPane.displayName = "PreviewPane";
