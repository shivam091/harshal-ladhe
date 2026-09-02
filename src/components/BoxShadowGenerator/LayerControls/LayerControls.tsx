import type { JSX } from "react";
import type { LayerControlsProps } from "@/interfaces/box-shadow";
import { FieldWrapper, FieldLabel, ColorInput, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/BoxShadowGenerator/Slider/Slider";
import { Fields } from "@/components/BoxShadowGenerator/LayerControls/LayerControls.styles";

/*
  Full slider/color/inset controls for whichever layer LayerList currently has selected. Kept
  separate from LayerList itself (which only shows compact summary chips) so this panel's fields
  don't have to re-render — or even exist — for every layer at once, only the one being edited.
*/
export default function LayerControls({ state, actions }: LayerControlsProps): JSX.Element {
  const layer = state.layers.find((candidate) => candidate.id === state.selectedLayerId);
  if (!layer) return <></>;

  const patch = (fields: Parameters<typeof actions.updateLayer>[1]) => actions.updateLayer(layer.id, fields);

  return (
    <>
      <Fields>
        <Slider label="Offset X" min={-50} max={50} value={layer.offsetX} suffix="px" onChange={(offsetX) => patch({ offsetX })} onCommit={actions.commitDrag} />
        <Slider label="Offset Y" min={-50} max={50} value={layer.offsetY} suffix="px" onChange={(offsetY) => patch({ offsetY })} onCommit={actions.commitDrag} />
        <Slider label="Blur" min={0} max={100} value={layer.blur} suffix="px" onChange={(blur) => patch({ blur })} onCommit={actions.commitDrag} />
        <Slider label="Spread" min={-50} max={50} value={layer.spread} suffix="px" onChange={(spread) => patch({ spread })} onCommit={actions.commitDrag} />
        <Slider label="Opacity" min={0} max={100} value={layer.opacity} suffix="%" onChange={(opacity) => patch({ opacity })} onCommit={actions.commitDrag} />

        <FieldWrapper>
          <FieldLabel htmlFor="box-shadow-layer-color">Color</FieldLabel>
          <ColorInput
            id="box-shadow-layer-color"
            type="color"
            value={layer.color}
            onChange={(event) => patch({ color: event.target.value })}
            onBlur={actions.commitDrag}
          />
        </FieldWrapper>

        <FieldWrapper data-inline="true">
          <FieldLabel htmlFor="box-shadow-layer-inset">Inset</FieldLabel>
          <CheckboxInput
            id="box-shadow-layer-inset"
            type="checkbox"
            checked={layer.inset}
            onChange={(event) => actions.toggleInset(layer.id, event.target.checked)}
          />
        </FieldWrapper>
      </Fields>
    </>
  );
}

LayerControls.displayName = "LayerControls";
