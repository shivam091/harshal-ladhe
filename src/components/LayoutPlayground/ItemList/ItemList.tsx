import type { JSX } from "react";
import { PlusIcon, CloseIcon, DuplicateIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { LayoutItem, ItemListProps } from "@/interfaces/layout-playground";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/LayoutPlayground/LayoutPlayground.styles";
import { Schedule, PartRow, PartButton, PartNumber, PartIcon, PartLabel, PartActions, IconButton, AddPartButton, EmptyState } from "@/components/LayoutPlayground/ItemList/ItemList.styles";

// Clamped so a single extreme flex-grow or grid span can't stretch a schedule icon into an illegibly thin sliver or an oversized bar.
const MIN_ASPECT = 0.4;
const MAX_ASPECT = 3;

// Width-to-height ratio PartIcon renders at for one item — flex mode reads it off flex-grow (a bigger grow reads as visually "wider"), grid mode off the ratio of its own column span to row span, so the icon is a genuine (if tiny) echo of how the item actually occupies the drawing.
function iconAspectRatio(item: LayoutItem, mode: ItemListProps["state"]["mode"]): number {
  const raw = mode === "flex" ? 1 + item.flex.grow : item.grid.columnSpan / item.grid.rowSpan;
  return Math.min(MAX_ASPECT, Math.max(MIN_ASPECT, raw));
}

/*
  The tool's flagship "parts schedule" flourish — every preview box listed the way a real
  engineering drawing's own corner table catalogs its parts: a monospace catalog number, a tiny
  hatched-rectangle icon echoing the part's own shape, and its label. Same shape as
  BoxShadowGenerator's own LayerList (add/duplicate/remove/select, no reordering needed here since
  an item's visual order comes from its own order/grid-placement fields, not array position).
  Selecting a row is how ItemControls below knows which item's fields to show.
*/
export default function ItemList({ state, actions }: ItemListProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Parts Schedule</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <FieldWrapper>
            <FieldLabel>Items</FieldLabel>

            {state.items.length === 0 && <EmptyState>No items yet — add one to start building a layout.</EmptyState>}

            {state.items.length > 0 && (
              <Schedule>
                {state.items.map((item, index) => (
                  <PartRow key={item.id} data-selected={state.selectedItemId === item.id ? "true" : undefined}>
                    <PartButton type="button" onClick={() => actions.selectItem(item.id)}>
                      <PartNumber>#{String(index + 1).padStart(2, "0")}</PartNumber>
                      <PartIcon style={{ color: item.color, aspectRatio: iconAspectRatio(item, state.mode) }} />
                      <PartLabel>Item {item.label}</PartLabel>
                    </PartButton>

                    <PartActions>
                      <IconButton type="button" aria-label={`Duplicate item ${item.label}`} onClick={() => actions.duplicateItem(item.id)}>
                        <DuplicateIcon size={14} />
                      </IconButton>
                      <IconButton type="button" aria-label={`Remove item ${item.label}`} onClick={() => actions.removeItem(item.id)}>
                        <CloseIcon size={14} />
                      </IconButton>
                    </PartActions>
                  </PartRow>
                ))}
              </Schedule>
            )}

            <AddPartButton type="button" onClick={actions.addItem}>
              <PlusIcon size={13} />
              Add item
            </AddPartButton>
          </FieldWrapper>
        </PanelBody>
      </Panel>
    </>
  );
}

ItemList.displayName = "ItemList";
