import type { JSX } from "react";
import { FILTER_FUNCTION_ORDER } from "@/interfaces/filter";
import type { FilterFunctionName, FunctionListProps } from "@/interfaces/filter";
import { FUNCTION_META } from "@/utils/filter";
import { FieldWrapper, FieldLabel, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/FilterGenerator/Slider/Slider";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/FilterGenerator/FilterGenerator.styles";
import { Rack, Rail, Slot, SlotRow, LensToggle, SlotLabel, SlotReadout, SlotDetail, DropShadowFields } from "@/components/FilterGenerator/FunctionList/FunctionList.styles";

// Human-readable name for each function's own lens slot.
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

// Slot numbers are fixed application order, not a reorderable list (see FILTER_FUNCTION_ORDER's own comment) — "01" through "10" (9 functions + drop-shadow) zero-padded so every engraved lens number lines up at the same width.
function slotNumber(index: number, total: number): string {
  return String(index + 1).padStart(String(total).length, "0");
}

/*
  The tool's flagship flourish: every CSS filter function rendered as a numbered lens slotted into a
  physical rack, connected end to end by a sprocket-perforated rail (Rail) — order is fixed and
  matches CSS's own left-to-right filter application, so numbering the slots keeps that sequence
  legible even without drag-to-reorder. A toggle plus, once enabled, that function's own slider is
  revealed right under its own slot — rather than a separate "select one, then edit it in a detail
  panel" step like BoxShadowGenerator's LayerList/LayerControls split. That indirection exists there
  because layers are an arbitrary, growable list; this rack's function set is fixed at 9 (plus
  drop-shadow), so showing each one's control right under its own toggle reads faster than making
  every edit a two-step "select, then adjust."
*/
export default function FunctionList({ state, actions }: FunctionListProps): JSX.Element {
  const totalSlots = FILTER_FUNCTION_ORDER.length + 1;

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Lens Rack</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <Rack>
            <Rail aria-hidden="true" />

            {FILTER_FUNCTION_ORDER.map((name, index) => {
              const meta = FUNCTION_META[name];
              const fn = state.functions[name];
              return (
                <Slot key={name}>
                  <SlotRow>
                    <LensToggle
                      type="button"
                      role="switch"
                      aria-checked={fn.enabled}
                      aria-label={`${fn.enabled ? "Remove" : "Slot in"} ${FUNCTION_LABELS[name]}`}
                      data-enabled={fn.enabled ? "true" : undefined}
                      onClick={() => actions.toggleFunction(name, !fn.enabled)}
                    >
                      {slotNumber(index, totalSlots)}
                    </LensToggle>
                    <SlotLabel>{FUNCTION_LABELS[name]}</SlotLabel>
                    {fn.enabled && (
                      <SlotReadout>
                        {Math.round(fn.value)}
                        {meta.unit}
                      </SlotReadout>
                    )}
                  </SlotRow>
                  {fn.enabled && (
                    <SlotDetail>
                      <Slider
                        label={FUNCTION_LABELS[name]}
                        min={meta.min}
                        max={meta.max}
                        value={fn.value}
                        suffix={meta.unit}
                        onChange={(value) => actions.setFunctionValue(name, value)}
                        onCommit={actions.commitDrag}
                      />
                    </SlotDetail>
                  )}
                </Slot>
              );
            })}

            <Slot>
              <SlotRow>
                <LensToggle
                  type="button"
                  role="switch"
                  aria-checked={state.dropShadow.enabled}
                  aria-label={`${state.dropShadow.enabled ? "Remove" : "Slot in"} drop shadow`}
                  data-enabled={state.dropShadow.enabled ? "true" : undefined}
                  onClick={() => actions.toggleDropShadow(!state.dropShadow.enabled)}
                >
                  {slotNumber(FILTER_FUNCTION_ORDER.length, totalSlots)}
                </LensToggle>
                <SlotLabel>Drop shadow</SlotLabel>
              </SlotRow>
              {state.dropShadow.enabled && (
                <SlotDetail>
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
                </SlotDetail>
              )}
            </Slot>
          </Rack>
        </PanelBody>
      </Panel>
    </>
  );
}

FunctionList.displayName = "FunctionList";
