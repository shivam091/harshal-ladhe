import type { JSX } from "react";
import type { LayerControlsProps } from "@/interfaces/box-shadow";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/BoxShadowGenerator/Slider/Slider";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BoxShadowGenerator/BoxShadowGenerator.styles";
import { Fields, Row, InsetToggle, InsetKnob, EmptyState } from "@/components/BoxShadowGenerator/LayerControls/LayerControls.styles";

/*
  Full slider/color/inset controls for whichever layer LayerList currently has selected. Kept
  separate from LayerList itself (which only shows compact summary cards) so this panel's fields
  don't have to re-render — or even exist — for every layer at once, only the one being edited.
*/
export default function LayerControls({ state, actions }: LayerControlsProps): JSX.Element {
  const layer = state.layers.find((candidate) => candidate.id === state.selectedLayerId);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Layer</PanelTitle>
        </PanelHeader>
        <PanelBody>
          {!layer && <EmptyState>Select a layer from the stack to edit it.</EmptyState>}

          {layer && (
            <Fields>
              <Slider
                label="Offset X"
                min={-50}
                max={50}
                value={layer.offsetX}
                suffix="px"
                onChange={(offsetX) => actions.updateLayer(layer.id, { offsetX })}
                onCommit={actions.commitDrag}
              />
              <Slider
                label="Offset Y"
                min={-50}
                max={50}
                value={layer.offsetY}
                suffix="px"
                onChange={(offsetY) => actions.updateLayer(layer.id, { offsetY })}
                onCommit={actions.commitDrag}
              />
              <Slider
                label="Blur"
                min={0}
                max={100}
                value={layer.blur}
                suffix="px"
                onChange={(blur) => actions.updateLayer(layer.id, { blur })}
                onCommit={actions.commitDrag}
              />
              <Slider
                label="Spread"
                min={-50}
                max={50}
                value={layer.spread}
                suffix="px"
                onChange={(spread) => actions.updateLayer(layer.id, { spread })}
                onCommit={actions.commitDrag}
              />
              <Slider
                label="Opacity"
                min={0}
                max={100}
                value={layer.opacity}
                suffix="%"
                onChange={(opacity) => actions.updateLayer(layer.id, { opacity })}
                onCommit={actions.commitDrag}
              />

              <Row>
                <FieldWrapper>
                  <FieldLabel htmlFor="box-shadow-layer-color">Color</FieldLabel>
                  <ColorInput
                    id="box-shadow-layer-color"
                    type="color"
                    value={layer.color}
                    onChange={(event) => actions.updateLayer(layer.id, { color: event.target.value })}
                    onBlur={actions.commitDrag}
                  />
                </FieldWrapper>

                <FieldWrapper>
                  <FieldLabel as="span">Inset</FieldLabel>
                  <InsetToggle
                    type="button"
                    role="switch"
                    aria-checked={layer.inset}
                    aria-label="Inset shadow"
                    data-checked={layer.inset ? "true" : undefined}
                    onClick={() => actions.toggleInset(layer.id, !layer.inset)}
                  >
                    <InsetKnob />
                  </InsetToggle>
                </FieldWrapper>
              </Row>
            </Fields>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

LayerControls.displayName = "LayerControls";
