import type { JSX } from "react";
import type { SeedControlsProps } from "@/interfaces/color-palette";
import HexColorField from "@/components/ColorPaletteGenerator/HexColorField/HexColorField";

// The one color every ramp step is derived from — both the OKLCH and RGB-mix modes in RampDisplay read this same value.
export default function SeedControls({ state, actions }: SeedControlsProps): JSX.Element {
  return (
    <>
      <HexColorField id="color-palette-seed" label="Seed color" value={state.seedColor} onChange={actions.setSeedColor} onCommit={actions.commitDrag} />
    </>
  );
}

SeedControls.displayName = "SeedControls";
