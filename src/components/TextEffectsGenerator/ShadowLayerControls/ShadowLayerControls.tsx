import type { JSX } from "react";
import type { ShadowLayerControlsProps } from "@/interfaces/text-effects";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/TextEffectsGenerator/Slider/Slider";
import { Fields, EmptyState } from "@/components/TextEffectsGenerator/ShadowLayerControls/ShadowLayerControls.styles";

/*
  Full slider/color controls for whichever shadow layer ShadowLayerList currently has selected —
  no spread or inset field, since text-shadow's own syntax has neither (see TextShadowLayer's own
  comment). Kept separate from ShadowLayerList itself (which only shows compact spec rows) so this
  panel's fields don't have to re-render — or even exist — for every layer at once, only the one
  being edited, mirroring BoxShadowGenerator's own LayerControls/LayerList split.
*/
export default function ShadowLayerControls({ state, actions }: ShadowLayerControlsProps): JSX.Element {
  const layer = state.shadowLayers.find((candidate) => candidate.id === state.selectedLayerId);

  return (
    <>
      {!layer && <EmptyState>Select a layer from the manuscript to edit it.</EmptyState>}

      {layer && (
        <Fields>
          <Slider label="Offset X" min={-50} max={50} value={layer.offsetX} suffix="px" onChange={(offsetX) => actions.updateShadowLayer(layer.id, { offsetX })} onCommit={actions.commitDrag} />
          <Slider label="Offset Y" min={-50} max={50} value={layer.offsetY} suffix="px" onChange={(offsetY) => actions.updateShadowLayer(layer.id, { offsetY })} onCommit={actions.commitDrag} />
          <Slider label="Blur" min={0} max={80} value={layer.blur} suffix="px" onChange={(blur) => actions.updateShadowLayer(layer.id, { blur })} onCommit={actions.commitDrag} />
          <Slider label="Opacity" min={0} max={100} value={layer.opacity} suffix="%" onChange={(opacity) => actions.updateShadowLayer(layer.id, { opacity })} onCommit={actions.commitDrag} />

          <FieldWrapper>
            <FieldLabel htmlFor="text-effects-layer-color">Color</FieldLabel>
            <ColorInput id="text-effects-layer-color" type="color" value={layer.color} onChange={(event) => actions.updateShadowLayer(layer.id, { color: event.target.value })} onBlur={actions.commitDrag} />
          </FieldWrapper>
        </Fields>
      )}
    </>
  );
}

ShadowLayerControls.displayName = "ShadowLayerControls";
