import type { JSX } from "react";
import type { SurfaceControlsProps } from "@/interfaces/box-shadow";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/BoxShadowGenerator/Slider/Slider";

/*
  The shape/stage colors and radius that surround the shadow itself — split out from
  LayerControls since these apply to the whole preview, not to any one layer. Matters most for
  neumorphism: that look only reads correctly when surfaceColor and pageColor are the same (or
  near-identical), which is exactly what the Soft UI presets rely on these two fields for.
*/
export default function SurfaceControls({ state, actions }: SurfaceControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor="box-shadow-surface-color">Surface color</FieldLabel>
        <ColorInput
          id="box-shadow-surface-color"
          type="color"
          value={state.surfaceColor}
          onChange={(event) => actions.setSurfaceColor(event.target.value)}
          onBlur={actions.commitDrag}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="box-shadow-page-color">Page color</FieldLabel>
        <ColorInput
          id="box-shadow-page-color"
          type="color"
          value={state.pageColor}
          onChange={(event) => actions.setPageColor(event.target.value)}
          onBlur={actions.commitDrag}
        />
      </FieldWrapper>

      <Slider label="Border radius" min={0} max={80} value={state.borderRadius} suffix="px" onChange={actions.setBorderRadius} onCommit={actions.commitDrag} />
    </>
  );
}

SurfaceControls.displayName = "SurfaceControls";
