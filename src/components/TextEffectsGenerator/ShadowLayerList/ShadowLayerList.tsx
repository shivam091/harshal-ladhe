import type { JSX } from "react";
import { PlusIcon, TrashIcon, DuplicateIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { ShadowLayerListProps } from "@/interfaces/text-effects";
import { List, LayerRow, LayerButton, LayerSwatch, LayerSummary, LayerActions, IconButton, AddLayerButton, EmptyState } from "@/components/TextEffectsGenerator/ShadowLayerList/ShadowLayerList.styles";

// The arbitrary list of text-shadow layers — same shape as BoxShadowGenerator's own LayerList (add/duplicate/remove/select), since a text-shadow layer is structurally the same kind of thing minus spread/inset.
export default function ShadowLayerList({ state, actions }: ShadowLayerListProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Shadow layers</FieldLabel>

        {state.shadowLayers.length === 0 && <EmptyState>No shadow layers — add one to start.</EmptyState>}

        <List>
          {state.shadowLayers.map((layer) => (
            <LayerRow key={layer.id}>
              <LayerButton type="button" data-selected={state.selectedLayerId === layer.id ? "true" : undefined} onClick={() => actions.selectLayer(layer.id)}>
                <LayerSwatch style={{ background: layer.color }} />
                <LayerSummary>
                  {layer.offsetX}, {layer.offsetY}, {layer.blur}
                </LayerSummary>
              </LayerButton>

              <LayerActions>
                <IconButton type="button" aria-label="Duplicate layer" onClick={() => actions.duplicateShadowLayer(layer.id)}>
                  <DuplicateIcon size={14} />
                </IconButton>
                <IconButton type="button" aria-label="Remove layer" onClick={() => actions.removeShadowLayer(layer.id)}>
                  <TrashIcon size={14} />
                </IconButton>
              </LayerActions>
            </LayerRow>
          ))}
        </List>

        <AddLayerButton type="button" onClick={actions.addShadowLayer}>
          <PlusIcon size={14} />
          Add layer
        </AddLayerButton>
      </FieldWrapper>
    </>
  );
}

ShadowLayerList.displayName = "ShadowLayerList";
