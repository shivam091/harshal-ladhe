import type { JSX } from "react";
import { PlusIcon, TrashIcon, DuplicateIcon } from "@/components/Icon";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import type { ItemListProps } from "@/interfaces/layout-playground";
import { List, ItemRow, ItemButton, ItemSwatch, ItemLabel, ItemActions, IconButton, AddItemButton, EmptyState } from "@/components/LayoutPlayground/ItemList/ItemList.styles";

/*
  The arbitrary list of preview boxes — same shape as BoxShadowGenerator's own LayerList
  (add/duplicate/remove/select, no reordering needed here since an item's visual order comes from
  its own order/grid-placement fields, not array position). Selecting a row is how ItemControls
  below knows which item's fields to show.
*/
export default function ItemList({ state, actions }: ItemListProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Items</FieldLabel>

        {state.items.length === 0 && <EmptyState>No items yet — add one to start building a layout.</EmptyState>}

        <List>
          {state.items.map((item) => (
            <ItemRow key={item.id}>
              <ItemButton type="button" data-selected={state.selectedItemId === item.id ? "true" : undefined} onClick={() => actions.selectItem(item.id)}>
                <ItemSwatch style={{ background: item.color }}>{item.label}</ItemSwatch>
                <ItemLabel>Item {item.label}</ItemLabel>
              </ItemButton>

              <ItemActions>
                <IconButton type="button" aria-label={`Duplicate item ${item.label}`} onClick={() => actions.duplicateItem(item.id)}>
                  <DuplicateIcon size={14} />
                </IconButton>
                <IconButton type="button" aria-label={`Remove item ${item.label}`} onClick={() => actions.removeItem(item.id)}>
                  <TrashIcon size={14} />
                </IconButton>
              </ItemActions>
            </ItemRow>
          ))}
        </List>

        <AddItemButton type="button" onClick={actions.addItem}>
          <PlusIcon size={14} />
          Add item
        </AddItemButton>
      </FieldWrapper>
    </>
  );
}

ItemList.displayName = "ItemList";
