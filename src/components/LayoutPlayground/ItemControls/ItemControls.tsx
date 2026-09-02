import type { JSX } from "react";
import type { FlexAlignSelf, GridSelfAlignment, ItemControlsProps } from "@/interfaces/layout-playground";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/LayoutPlayground/Slider/Slider";
import { Fields, NumberInput, FieldRow } from "@/components/LayoutPlayground/ItemControls/ItemControls.styles";

const FLEX_ALIGN_SELF: FlexAlignSelf[] = ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"];
const GRID_SELF: GridSelfAlignment[] = ["auto", "stretch", "start", "end", "center"];

/*
  Full field set for whichever item ItemList currently has selected, swapping entirely between
  flex fields (order/grow/shrink/basis/align-self) and grid fields (column/row start+span,
  justify-self/align-self) based on state.mode — kept separate from ItemList itself (which only
  shows compact swatch chips) so this panel doesn't have to re-render for every item at once.
*/
export default function ItemControls({ state, actions }: ItemControlsProps): JSX.Element {
  const item = state.items.find((candidate) => candidate.id === state.selectedItemId);
  if (!item) return <></>;

  if (state.mode === "flex") {
    const patch = (fields: Parameters<typeof actions.updateFlexItem>[1]) => actions.updateFlexItem(item.id, fields);
    return (
      <>
        <Fields>
          <Slider label="Order" min={-10} max={10} value={item.flex.order} onChange={(order) => patch({ order })} onCommit={actions.commitDrag} />
          <Slider label="Grow" min={0} max={5} value={item.flex.grow} onChange={(grow) => patch({ grow })} onCommit={actions.commitDrag} />
          <Slider label="Shrink" min={0} max={5} value={item.flex.shrink} onChange={(shrink) => patch({ shrink })} onCommit={actions.commitDrag} />

          <FieldWrapper>
            <FieldLabel htmlFor="layout-item-basis">Basis</FieldLabel>
            <NumberInput id="layout-item-basis" type="text" value={item.flex.basis} onChange={(event) => patch({ basis: event.target.value })} onBlur={actions.commitDrag} />
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel htmlFor="layout-item-align-self">Align self</FieldLabel>
            <SelectWrapper>
              <SelectInput id="layout-item-align-self" value={item.flex.alignSelf} onChange={(event) => actions.updateFlexItem(item.id, { alignSelf: event.target.value as FlexAlignSelf })}>
                {FLEX_ALIGN_SELF.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
        </Fields>
      </>
    );
  }

  const patch = (fields: Parameters<typeof actions.updateGridItem>[1]) => actions.updateGridItem(item.id, fields);
  return (
    <>
      <Fields>
        <FieldRow>
          <FieldWrapper>
            <FieldLabel htmlFor="layout-item-column-start">Column start</FieldLabel>
            <NumberInput
              id="layout-item-column-start"
              type="number"
              min={1}
              max={20}
              value={item.grid.columnStart}
              onChange={(event) => patch({ columnStart: Number(event.target.value) })}
              onBlur={actions.commitDrag}
            />
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel htmlFor="layout-item-column-span">Column span</FieldLabel>
            <NumberInput
              id="layout-item-column-span"
              type="number"
              min={1}
              max={20}
              value={item.grid.columnSpan}
              onChange={(event) => patch({ columnSpan: Number(event.target.value) })}
              onBlur={actions.commitDrag}
            />
          </FieldWrapper>
        </FieldRow>

        <FieldRow>
          <FieldWrapper>
            <FieldLabel htmlFor="layout-item-row-start">Row start</FieldLabel>
            <NumberInput
              id="layout-item-row-start"
              type="number"
              min={1}
              max={20}
              value={item.grid.rowStart}
              onChange={(event) => patch({ rowStart: Number(event.target.value) })}
              onBlur={actions.commitDrag}
            />
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel htmlFor="layout-item-row-span">Row span</FieldLabel>
            <NumberInput
              id="layout-item-row-span"
              type="number"
              min={1}
              max={20}
              value={item.grid.rowSpan}
              onChange={(event) => patch({ rowSpan: Number(event.target.value) })}
              onBlur={actions.commitDrag}
            />
          </FieldWrapper>
        </FieldRow>

        <FieldWrapper>
          <FieldLabel htmlFor="layout-item-justify-self">Justify self</FieldLabel>
          <SelectWrapper>
            <SelectInput
              id="layout-item-justify-self"
              value={item.grid.justifySelf}
              onChange={(event) => actions.updateGridItem(item.id, { justifySelf: event.target.value as GridSelfAlignment })}
            >
              {GRID_SELF.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>

        <FieldWrapper>
          <FieldLabel htmlFor="layout-item-align-self-grid">Align self</FieldLabel>
          <SelectWrapper>
            <SelectInput
              id="layout-item-align-self-grid"
              value={item.grid.alignSelf}
              onChange={(event) => actions.updateGridItem(item.id, { alignSelf: event.target.value as GridSelfAlignment })}
            >
              {GRID_SELF.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>
      </Fields>
    </>
  );
}

ItemControls.displayName = "ItemControls";
