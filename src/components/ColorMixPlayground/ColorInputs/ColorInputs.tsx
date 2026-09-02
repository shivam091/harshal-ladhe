import type { JSX } from "react";
import { hexToOklch } from "@/utils/oklch";
import { SwapIcon } from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import HexColorField from "@/components/ColorMixPlayground/HexColorField/HexColorField";
import { ColorsRow, ColorFieldWrapper, SwapButton, OklchReadout } from "@/components/ColorMixPlayground/ColorInputs/ColorInputs.styles";
import type { ColorInputsProps } from "@/interfaces/color-mix";

// Rounded to 2 decimals — enough to see the numbers move between the two colors without float noise; purely informational, the tool's actual color-mix() output always uses the raw hex, not this readout.
function formatOklch(hex: string): string {
  const { L, C, H } = hexToOklch(hex);
  return `L ${L.toFixed(2)} C ${C.toFixed(2)} H ${H.toFixed(0)}°`;
}

/*
  Two hex color fields plus a swap button. Each field also prints its OKLCH triple underneath (via
  the same hexToOklch the Color Palette & Contrast Checker goodie uses) — a cheap way to hint at why
  the space picker below matters before the user has touched it.
*/
export default function ColorInputs({ state, actions }: ColorInputsProps): JSX.Element {
  return (
    <>
      <ColorsRow>
        <ColorFieldWrapper>
          <HexColorField id="color-mix-color1" label="Color 1" value={state.color1} onChange={actions.setColor1} onCommit={actions.commitDrag} />
          <OklchReadout>{formatOklch(state.color1)}</OklchReadout>
        </ColorFieldWrapper>

        <Tooltip content="Swap colors">
          <SwapButton type="button" onClick={actions.swapColors} aria-label="Swap colors">
            <SwapIcon size={16} />
          </SwapButton>
        </Tooltip>

        <ColorFieldWrapper>
          <HexColorField id="color-mix-color2" label="Color 2" value={state.color2} onChange={actions.setColor2} onCommit={actions.commitDrag} />
          <OklchReadout>{formatOklch(state.color2)}</OklchReadout>
        </ColorFieldWrapper>
      </ColorsRow>
    </>
  );
}

ColorInputs.displayName = "ColorInputs";
