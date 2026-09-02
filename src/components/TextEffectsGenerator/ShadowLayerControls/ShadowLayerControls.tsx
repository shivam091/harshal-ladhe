import type { JSX } from "react";
import type { ShadowLayerControlsProps } from "@/interfaces/text-effects";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/TextEffectsGenerator/Slider/Slider";

// Full slider/color controls for whichever shadow layer ShadowLayerList currently has selected — no spread or inset field, since text-shadow's own syntax has neither (see TextShadowLayer's own comment).
export default function ShadowLayerControls({ state, actions }: ShadowLayerControlsProps): JSX.Element {
  const layer = state.shadowLayers.find((candidate) => candidate.id === state.selectedLayerId);
  if (!layer) return <></>;

  const patch = (fields: Parameters<typeof actions.updateShadowLayer>[1]) => actions.updateShadowLayer(layer.id, fields);

  return (
    <>
      <Slider label="Offset X" min={-50} max={50} value={layer.offsetX} suffix="px" onChange={(offsetX) => patch({ offsetX })} onCommit={actions.commitDrag} />
      <Slider label="Offset Y" min={-50} max={50} value={layer.offsetY} suffix="px" onChange={(offsetY) => patch({ offsetY })} onCommit={actions.commitDrag} />
      <Slider label="Blur" min={0} max={80} value={layer.blur} suffix="px" onChange={(blur) => patch({ blur })} onCommit={actions.commitDrag} />
      <Slider label="Opacity" min={0} max={100} value={layer.opacity} suffix="%" onChange={(opacity) => patch({ opacity })} onCommit={actions.commitDrag} />

      <FieldWrapper>
        <FieldLabel htmlFor="text-effects-layer-color">Color</FieldLabel>
        <ColorInput id="text-effects-layer-color" type="color" value={layer.color} onChange={(event) => patch({ color: event.target.value })} onBlur={actions.commitDrag} />
      </FieldWrapper>
    </>
  );
}

ShadowLayerControls.displayName = "ShadowLayerControls";
