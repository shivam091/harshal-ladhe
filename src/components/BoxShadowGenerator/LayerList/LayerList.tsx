import type { JSX } from "react";
import { PlusIcon, TrashIcon, DuplicateIcon, ArrowUpIcon, ArrowDownIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { LayerListProps } from "@/interfaces/box-shadow";
import {
  List,
  LayerRow,
  LayerButton,
  LayerSwatch,
  LayerSummary,
  InsetBadge,
  LayerActions,
  IconButton,
  AddLayerButton,
  EmptyState
} from "@/components/BoxShadowGenerator/LayerList/LayerList.styles";

/*
  Compact reorderable stack of every shadow layer — selecting a row is how LayerControls below
  knows which layer's sliders to show. Reordering uses plain up/down buttons rather than a drag
  handle: with typically 1-5 layers, a drag gesture (and the pointer-capture plumbing it needs) buys
  little over two buttons, unlike StopEditor's bar in the gradient tool where position IS the value
  being edited.
*/
export default function LayerList({ state, actions }: LayerListProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Layers</FieldLabel>

        {state.layers.length === 0 && <EmptyState>No layers yet — add one to start building a shadow.</EmptyState>}

        <List>
          {state.layers.map((layer, index) => (
            <LayerRow key={layer.id}>
              <LayerButton type="button" data-selected={state.selectedLayerId === layer.id ? "true" : undefined} onClick={() => actions.selectLayer(layer.id)}>
                <LayerSwatch style={{ background: layer.color }} />
                <LayerSummary>
                  {layer.offsetX}, {layer.offsetY}, {layer.blur}, {layer.spread}
                </LayerSummary>
                {layer.inset && <InsetBadge>Inset</InsetBadge>}
              </LayerButton>

              <LayerActions>
                <IconButton type="button" disabled={index === 0} aria-label="Move layer up" onClick={() => actions.moveLayerUp(layer.id)}>
                  <ArrowUpIcon size={14} />
                </IconButton>
                <IconButton type="button" disabled={index === state.layers.length - 1} aria-label="Move layer down" onClick={() => actions.moveLayerDown(layer.id)}>
                  <ArrowDownIcon size={14} />
                </IconButton>
                <IconButton type="button" aria-label="Duplicate layer" onClick={() => actions.duplicateLayer(layer.id)}>
                  <DuplicateIcon size={14} />
                </IconButton>
                <IconButton type="button" aria-label="Remove layer" onClick={() => actions.removeLayer(layer.id)}>
                  <TrashIcon size={14} />
                </IconButton>
              </LayerActions>
            </LayerRow>
          ))}
        </List>

        <AddLayerButton type="button" onClick={actions.addLayer}>
          <PlusIcon size={14} />
          Add layer
        </AddLayerButton>
      </FieldWrapper>
    </>
  );
}

LayerList.displayName = "LayerList";
