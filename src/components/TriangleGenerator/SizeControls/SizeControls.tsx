import type { JSX } from "react";
import type { SizeControlsProps } from "@/interfaces/triangle";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/TriangleGenerator/Slider/Slider";

// Width/height always mean the shape's own rendered bounding box (see compileBorderTrickDeclarations/computeClipPathPolygon) — the slider means the same thing regardless of which technique or direction is active. Notch only matters for a clip-path chevron, so it's the one field gated on both technique and shape.
export default function SizeControls({ state, actions }: SizeControlsProps): JSX.Element {
  return (
    <>
      <Slider label="Width" min={4} max={300} value={state.width} suffix="px" onChange={(width) => actions.setWidth(width)} onCommit={actions.commitDrag} />
      <Slider label="Height" min={4} max={300} value={state.height} suffix="px" onChange={(height) => actions.setHeight(height)} onCommit={actions.commitDrag} />

      {state.technique === "clip-path" && state.shape === "chevron" && (
        <Slider label="Notch depth" min={5} max={45} value={state.notch} suffix="%" onChange={(notch) => actions.setNotch(notch)} onCommit={actions.commitDrag} />
      )}

      <FieldWrapper>
        <FieldLabel htmlFor="triangle-color">Fill color</FieldLabel>
        <ColorInput id="triangle-color" type="color" value={state.color} onChange={(event) => actions.setColor(event.target.value)} onBlur={actions.commitDrag} />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="triangle-page-color">Page color</FieldLabel>
        <ColorInput id="triangle-page-color" type="color" value={state.pageColor} onChange={(event) => actions.setPageColor(event.target.value)} onBlur={actions.commitDrag} />
      </FieldWrapper>
    </>
  );
}

SizeControls.displayName = "SizeControls";
