import type { JSX } from "react";
import type { ContentAlignment, FlexContainerControlsProps, FlexDirection, FlexWrap, GridAlignment } from "@/interfaces/layout-playground";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";

// flex-direction's own keyword set, in the order offered.
const DIRECTIONS: FlexDirection[] = ["row", "row-reverse", "column", "column-reverse"];
// flex-wrap's own keyword set, in the order offered.
const WRAPS: FlexWrap[] = ["nowrap", "wrap", "wrap-reverse"];
// justify-content's own keyword set (excluding "stretch", which justify-content never actually accepts), in the order offered.
const JUSTIFY: ContentAlignment[] = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"];
// align-items' own keyword set, in the order offered.
const ALIGN_ITEMS: GridAlignment[] = ["stretch", "start", "end", "center"];
// align-content's own keyword set, in the order offered.
const ALIGN_CONTENT: ContentAlignment[] = ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly", "stretch"];

// All five flex container properties as plain <select> dropdowns — every option here is a fixed CSS keyword, not a continuous value, so there's no slider/drag equivalent the way gap or a grid track's size has.
export default function FlexContainerControls({ state, actions }: FlexContainerControlsProps): JSX.Element {
  const { direction, wrap, justifyContent, alignItems, alignContent } = state.flexContainer;

  return (
    <>
      <FieldWrapper>
        <FieldLabel htmlFor="layout-flex-direction">Direction</FieldLabel>
        <SelectWrapper>
          <SelectInput id="layout-flex-direction" value={direction} onChange={(event) => actions.updateFlexContainer({ direction: event.target.value as FlexDirection })}>
            {DIRECTIONS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="layout-flex-wrap">Wrap</FieldLabel>
        <SelectWrapper>
          <SelectInput id="layout-flex-wrap" value={wrap} onChange={(event) => actions.updateFlexContainer({ wrap: event.target.value as FlexWrap })}>
            {WRAPS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="layout-flex-justify-content">Justify content</FieldLabel>
        <SelectWrapper>
          <SelectInput
            id="layout-flex-justify-content"
            value={justifyContent}
            onChange={(event) => actions.updateFlexContainer({ justifyContent: event.target.value as ContentAlignment })}
          >
            {JUSTIFY.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="layout-flex-align-items">Align items</FieldLabel>
        <SelectWrapper>
          <SelectInput id="layout-flex-align-items" value={alignItems} onChange={(event) => actions.updateFlexContainer({ alignItems: event.target.value as GridAlignment })}>
            {ALIGN_ITEMS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor="layout-flex-align-content">Align content</FieldLabel>
        <SelectWrapper>
          <SelectInput
            id="layout-flex-align-content"
            value={alignContent}
            onChange={(event) => actions.updateFlexContainer({ alignContent: event.target.value as ContentAlignment })}
          >
            {ALIGN_CONTENT.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>
    </>
  );
}

FlexContainerControls.displayName = "FlexContainerControls";
