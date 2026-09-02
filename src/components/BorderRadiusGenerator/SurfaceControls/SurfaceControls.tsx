import type { JSX } from "react";
import type { SurfaceControlsProps } from "@/interfaces/border-radius";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/BorderRadiusGenerator/Slider/Slider";

// The shape/stage colors and reference size around the blob itself — split out from the corner controls since these apply to the whole preview, not to any one corner. `size` is also what RadiusOverlay's drag math and every corner's max-radius clamp are scaled against.
export default function SurfaceControls({ state, actions }: SurfaceControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor="blob-surface-color">Surface color</FieldLabel>
        <ColorInput
          id="blob-surface-color"
          type="color"
          value={state.surfaceColor}
          onChange={(event) => actions.setSurfaceColor(event.target.value)}
          onBlur={actions.commitDrag}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="blob-page-color">Page color</FieldLabel>
        <ColorInput id="blob-page-color" type="color" value={state.pageColor} onChange={(event) => actions.setPageColor(event.target.value)} onBlur={actions.commitDrag} />
      </FieldWrapper>

      <Slider label="Size" min={80} max={320} value={state.size} suffix="px" onChange={actions.setSize} onCommit={actions.commitDrag} />
    </>
  );
}

SurfaceControls.displayName = "SurfaceControls";
