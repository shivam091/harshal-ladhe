import type { JSX } from "react";
import { FILTER_FUNCTION_ORDER } from "@/interfaces/filter";
import type { FilterFunctionName, FunctionListProps } from "@/interfaces/filter";
import { FUNCTION_META } from "@/utils/filter";
import { FieldWrapper, FieldLabel, ColorInput, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/FilterGenerator/Slider/Slider";
import { List, FunctionRow, ToggleRow, FunctionName, SliderWrapper, DropShadowFields } from "@/components/FilterGenerator/FunctionList/FunctionList.styles";

const FUNCTION_LABELS: Record<FilterFunctionName, string> = {
  blur: "Blur",
  brightness: "Brightness",
  contrast: "Contrast",
  grayscale: "Grayscale",
  hueRotate: "Hue rotate",
  invert: "Invert",
  opacity: "Opacity",
  saturate: "Saturate",
  sepia: "Sepia"
};

/*
  A checklist of every CSS filter function this tool exposes: a toggle plus, once enabled, that
  function's own slider revealed inline — rather than a separate "select a function, then edit it
  in a detail panel" step like BoxShadowGenerator's LayerList/LayerControls split. That indirection
  exists there because layers are an arbitrary, growable list; this tool's function set is fixed at
  9 (plus drop-shadow), so showing each one's control right under its own toggle reads faster than
  making every edit a two-step "select, then adjust."
*/
export default function FunctionList({ state, actions }: FunctionListProps): JSX.Element {
  return (
    <>
      <List>
        {FILTER_FUNCTION_ORDER.map((name) => {
          const meta = FUNCTION_META[name];
          const fn = state.functions[name];
          return (
            <FunctionRow key={name}>
              <ToggleRow>
                <CheckboxInput type="checkbox" checked={fn.enabled} onChange={(event) => actions.toggleFunction(name, event.target.checked)} />
                <FunctionName>{FUNCTION_LABELS[name]}</FunctionName>
              </ToggleRow>
              {fn.enabled && (
                <SliderWrapper>
                  <Slider
                    label={FUNCTION_LABELS[name]}
                    min={meta.min}
                    max={meta.max}
                    value={fn.value}
                    suffix={meta.unit}
                    onChange={(value) => actions.setFunctionValue(name, value)}
                    onCommit={actions.commitDrag}
                  />
                </SliderWrapper>
              )}
            </FunctionRow>
          );
        })}

        <FunctionRow>
          <ToggleRow>
            <CheckboxInput type="checkbox" checked={state.dropShadow.enabled} onChange={(event) => actions.toggleDropShadow(event.target.checked)} />
            <FunctionName>Drop shadow</FunctionName>
          </ToggleRow>
          {state.dropShadow.enabled && (
            <DropShadowFields>
              <Slider
                label="Offset X"
                min={-50}
                max={50}
                value={state.dropShadow.offsetX}
                suffix="px"
                onChange={(offsetX) => actions.updateDropShadow({ offsetX })}
                onCommit={actions.commitDrag}
              />
              <Slider
                label="Offset Y"
                min={-50}
                max={50}
                value={state.dropShadow.offsetY}
                suffix="px"
                onChange={(offsetY) => actions.updateDropShadow({ offsetY })}
                onCommit={actions.commitDrag}
              />
              <Slider
                label="Blur"
                min={0}
                max={50}
                value={state.dropShadow.blur}
                suffix="px"
                onChange={(blur) => actions.updateDropShadow({ blur })}
                onCommit={actions.commitDrag}
              />
              <Slider
                label="Opacity"
                min={0}
                max={100}
                value={state.dropShadow.opacity}
                suffix="%"
                onChange={(opacity) => actions.updateDropShadow({ opacity })}
                onCommit={actions.commitDrag}
              />
              <FieldWrapper>
                <FieldLabel htmlFor="filter-drop-shadow-color">Color</FieldLabel>
                <ColorInput
                  id="filter-drop-shadow-color"
                  type="color"
                  value={state.dropShadow.color}
                  onChange={(event) => actions.updateDropShadow({ color: event.target.value })}
                  onBlur={actions.commitDrag}
                />
              </FieldWrapper>
            </DropShadowFields>
          )}
        </FunctionRow>
      </List>
    </>
  );
}

FunctionList.displayName = "FunctionList";
