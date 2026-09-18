import type { JSX } from "react";
import type { ViewportControlsProps } from "@/interfaces/fluid-type";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/FluidTypeCalculator/Slider/Slider";

// The two viewport breakpoints and root font size every step's clamp() is computed against, plus the preview's own page color. Kept separate from the step list/controls since these bounds apply to the whole scale, not any one step.
export default function ViewportControls({ state, actions }: ViewportControlsProps): JSX.Element {
  return (
    <>
      <Slider label="Min viewport" min={200} max={state.maxViewport - 40} value={state.minViewport} suffix="px" onChange={(px) => actions.setMinViewport(px)} onCommit={actions.commitDrag} />
      <Slider label="Max viewport" min={state.minViewport + 40} max={2560} value={state.maxViewport} suffix="px" onChange={(px) => actions.setMaxViewport(px)} onCommit={actions.commitDrag} />
      <Slider label="Root font size" min={10} max={24} value={state.rootFontSize} suffix="px" onChange={(px) => actions.setRootFontSize(px)} onCommit={actions.commitDrag} />

      <FieldWrapper>
        <FieldLabel htmlFor="fluid-type-page-color">Page color</FieldLabel>
        <ColorInput id="fluid-type-page-color" type="color" value={state.pageColor} onChange={(event) => actions.setPageColor(event.target.value)} onBlur={actions.commitDrag} />
      </FieldWrapper>
    </>
  );
}

ViewportControls.displayName = "ViewportControls";
