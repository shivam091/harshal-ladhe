import type { CSSProperties, JSX } from "react";
import { PlusIcon, CloseIcon, DuplicateIcon, ArrowUpIcon, ArrowDownIcon } from "@/components/Icon";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BoxShadowGenerator/BoxShadowGenerator.styles";
import { Deck, LayerRow, LayerButton, LayerSwatch, LayerSummary, InsetBadge, LayerActions, IconButton, AddLayerButton, EmptyState } from "@/components/BoxShadowGenerator/LayerList/LayerList.styles";
import type { LayerListProps } from "@/interfaces/box-shadow";

/*
  The tool's flagship flourish: every shadow layer rendered as a card in a physically stacked deck.
  `--depth` (the layer's own index) drives the whole illusion purely through LayerList.styles —
  the first layer (CSS's own "closest to the viewer" layer, see ShadowLayer's comment) sits with the
  tightest shadow and no stagger, and each layer below it gets a little more vertical offset and a
  bigger, softer shadow, so the deck itself looks like a cross-section of the very stack it
  represents. Reordering uses plain up/down buttons rather than a drag handle: with typically 1-5
  layers, a drag gesture (and the pointer-capture plumbing it needs) buys little over two buttons —
  each one is instead styled to "lift" on press, so reordering still reads as picking a card up off
  the stack and setting it back down a slot over.
*/
export default function LayerList({ state, actions }: LayerListProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Layers</PanelTitle>
        </PanelHeader>
        <PanelBody>
          {state.layers.length === 0 && <EmptyState>No layers yet — add one to start building a shadow.</EmptyState>}

          <Deck>
            {state.layers.map((layer, index) => (
              <LayerRow key={layer.id} style={{ "--depth": index } as CSSProperties} data-selected={state.selectedLayerId === layer.id ? "true" : undefined}>
                <LayerButton type="button" onClick={() => actions.selectLayer(layer.id)}>
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
                    <CloseIcon size={14} />
                  </IconButton>
                </LayerActions>
              </LayerRow>
            ))}
          </Deck>

          <AddLayerButton type="button" onClick={actions.addLayer}>
            <PlusIcon size={14} />
            Add layer
          </AddLayerButton>
        </PanelBody>
      </Panel>
    </>
  );
}

LayerList.displayName = "LayerList";
