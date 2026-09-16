import type { JSX } from "react";
import { PlusIcon, CloseIcon, DuplicateIcon } from "@/components/Icon";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/TextEffectsGenerator/TextEffectsGenerator.styles";
import { Manuscript, SpecRow, SpecNumber, SpecButton, SpecSwatch, SpecReadout, SpecActions, IconButton, AddLayerButton, EmptyState } from "@/components/TextEffectsGenerator/ShadowLayerList/ShadowLayerList.styles";
import type { ShadowLayerListProps } from "@/interfaces/text-effects";

// Zero-pads a row's line number to two digits, e.g. "01" — a print production sheet's own line-numbering convention, distinct from a plain "1." list marker.
function lineNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/*
  The tool's second flagship flourish: every text-shadow layer rendered as a numbered row in a
  manuscript-style spec sheet rather than a physical card. Selecting a row draws a red proofing-mark
  bar along its leading edge (see SpecRow's own comment) instead of lifting it off a surface — the
  deliberate interaction-feel contrast with BoxShadowGenerator's stacked-deck LayerList: this is a
  list you annotate, not a stack you pick up. Reordering isn't offered at all (unlike LayerList's
  up/down buttons) since text-shadow layers read as independent glow/outline/extrude notes rather
  than a physically stacked depth cross-section — their relative order rarely matters visually the
  way a box-shadow's does.
*/
export default function ShadowLayerList({ state, actions }: ShadowLayerListProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Shadow layers</PanelTitle>
        </PanelHeader>
        <PanelBody>
          {state.shadowLayers.length === 0 && <EmptyState>No shadow layers — add one to start.</EmptyState>}

          <Manuscript>
            {state.shadowLayers.map((layer, index) => (
              <SpecRow key={layer.id} data-selected={state.selectedLayerId === layer.id ? "true" : undefined}>
                <SpecNumber aria-hidden="true">{lineNumber(index)}</SpecNumber>

                <SpecButton type="button" onClick={() => actions.selectLayer(layer.id)}>
                  <SpecSwatch style={{ background: layer.color }} />
                  <SpecReadout>
                    Δx{layer.offsetX} Δy{layer.offsetY} ↝{layer.blur} {layer.opacity}%
                  </SpecReadout>
                </SpecButton>

                <SpecActions>
                  <IconButton type="button" aria-label="Duplicate layer" onClick={() => actions.duplicateShadowLayer(layer.id)}>
                    <DuplicateIcon size={14} />
                  </IconButton>
                  <IconButton type="button" aria-label="Remove layer" onClick={() => actions.removeShadowLayer(layer.id)}>
                    <CloseIcon size={14} />
                  </IconButton>
                </SpecActions>
              </SpecRow>
            ))}
          </Manuscript>

          <AddLayerButton type="button" onClick={actions.addShadowLayer}>
            <PlusIcon size={14} />
            Add layer
          </AddLayerButton>
        </PanelBody>
      </Panel>
    </>
  );
}

ShadowLayerList.displayName = "ShadowLayerList";
