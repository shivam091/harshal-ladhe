import type { JSX } from "react";
import type { LayoutMode, ModeControlsProps } from "@/interfaces/layout-playground";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/LayoutPlayground/Slider/Slider";
import { StencilRow, StencilButton } from "@/components/LayoutPlayground/ModeControls/ModeControls.styles";

// The two stencils on offer, in the order they're laid out left to right.
const MODES: Array<{ id: LayoutMode; label: string }> = [
  { id: "flex", label: "Flexbox" },
  { id: "grid", label: "Grid" }
];

// Layout mode switcher plus the two fields that apply regardless of mode: gap (both flex and grid share the exact same `gap` property) and the drafting sheet's own width (what wrap and track-sizing behavior are actually relative to).
export default function ModeControls({ state, actions }: ModeControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Mode</FieldLabel>
        <StencilRow role="radiogroup" aria-label="Layout mode">
          {MODES.map((mode) => (
            <StencilButton
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={state.mode === mode.id}
              data-selected={state.mode === mode.id ? "true" : undefined}
              onClick={() => actions.setMode(mode.id)}
            >
              {mode.label}
            </StencilButton>
          ))}
        </StencilRow>
      </FieldWrapper>

      <Slider label="Gap" min={0} max={64} value={state.gap} suffix="px" onChange={actions.setGap} onCommit={actions.commitDrag} />
      <Slider label="Sheet width" min={200} max={900} value={state.containerWidth} suffix="px" onChange={actions.setContainerWidth} onCommit={actions.commitDrag} />
    </>
  );
}

ModeControls.displayName = "ModeControls";
