import type { JSX } from "react";
import { SwapIcon } from "@/components/Icon";
import type { ContrastControlsProps } from "@/interfaces/color-palette";
import HexColorField from "@/components/ColorPaletteGenerator/HexColorField/HexColorField";
import { SwapButton } from "@/components/ColorPaletteGenerator/ContrastControls/ContrastControls.styles";

// The pair ContrastResult checks against each other — independent of the seed/ramp, since a real contrast check is usually between an existing text and background color, not necessarily the seed itself.
export default function ContrastControls({ state, actions }: ContrastControlsProps): JSX.Element {
  return (
    <>
      <HexColorField id="color-palette-fg" label="Foreground (text)" value={state.foreground} onChange={actions.setForeground} onCommit={actions.commitDrag} />
      <HexColorField id="color-palette-bg" label="Background" value={state.background} onChange={actions.setBackground} onCommit={actions.commitDrag} />
      <SwapButton type="button" onClick={actions.swapContrastPair}>
        <SwapIcon size={14} />
        Swap
      </SwapButton>
    </>
  );
}

ContrastControls.displayName = "ContrastControls";
