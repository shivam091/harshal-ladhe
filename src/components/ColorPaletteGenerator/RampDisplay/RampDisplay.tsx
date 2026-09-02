import type { JSX } from "react";
import { generateRamp } from "@/utils/color-ramp";
import type { RampDisplayProps } from "@/interfaces/color-palette";
import { PanelTitleRow, PanelTitle } from "@/components/ColorPaletteGenerator/ColorPaletteGenerator.styles";
import { ModeRow, ModeButton, Strip, Swatch, SwatchColor, SwatchMeta, SwatchName, SwatchHex } from "@/components/ColorPaletteGenerator/RampDisplay/RampDisplay.styles";

const MODES = [
  { id: "oklch", label: "OKLCH" },
  { id: "mix", label: "RGB mix" }
] as const;

/*
  Clicking a swatch sends it straight to the contrast checker's background — the one place the two
  halves of this tool meet, letting someone try a generated shade as a real background without
  retyping its hex into ContrastControls by hand.
*/
export default function RampDisplay({ state, actions }: RampDisplayProps): JSX.Element {
  const ramp = generateRamp(state.seedColor, state.rampMode);

  return (
    <>
      <PanelTitleRow>
        <PanelTitle>Ramp</PanelTitle>
        <ModeRow role="tablist" aria-label="Ramp generation mode">
          {MODES.map((mode) => (
            <ModeButton key={mode.id} type="button" role="tab" aria-selected={mode.id === state.rampMode} data-selected={mode.id === state.rampMode ? "true" : undefined} onClick={() => actions.setRampMode(mode.id)}>
              {mode.label}
            </ModeButton>
          ))}
        </ModeRow>
      </PanelTitleRow>

      <Strip>
        {ramp.map((step) => (
          <Swatch key={step.name} type="button" title={`Use ${step.hex} as the contrast checker's background`} onClick={() => actions.useAsBackground(step.hex)}>
            <SwatchColor style={{ background: step.hex }} />
            <SwatchMeta>
              <SwatchName>{step.name}</SwatchName>
              <SwatchHex>{step.hex}</SwatchHex>
            </SwatchMeta>
          </Swatch>
        ))}
      </Strip>
    </>
  );
}

RampDisplay.displayName = "RampDisplay";
