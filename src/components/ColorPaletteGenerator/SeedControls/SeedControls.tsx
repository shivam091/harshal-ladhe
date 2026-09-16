import type { JSX } from "react";
import type { SeedControlsProps } from "@/interfaces/color-palette";
import HexColorField from "@/components/ColorPaletteGenerator/HexColorField/HexColorField";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";

// The one color every ramp step is derived from — both the OKLCH and RGB-mix modes in RampDisplay read this same value.
export default function SeedControls({ state, actions }: SeedControlsProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Seed Ink</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <HexColorField id="color-palette-seed" label="Seed color" value={state.seedColor} onChange={actions.setSeedColor} onCommit={actions.commitDrag} />
        </PanelBody>
      </Panel>
    </>
  );
}

SeedControls.displayName = "SeedControls";
