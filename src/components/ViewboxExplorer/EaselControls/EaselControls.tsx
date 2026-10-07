import type { ChangeEvent, JSX } from "react";
import Slider from "@/components/ViewboxExplorer/Slider/Slider";
import { VIEWPORT_MAX, VIEWPORT_MIN, clampViewBox, minimumSizeFor } from "@/components/ViewboxExplorer/ViewboxExplorer.utils";
import { SectionCard, PanelTitle, ButtonRow, TimerButton } from "@/components/ViewboxExplorer/ViewboxExplorer.styles";
import { NumberGrid, NumberField, NumberInput, ToggleRow } from "@/components/ViewboxExplorer/EaselControls/EaselControls.styles";
import type { EaselControlsProps, OverlayToggles, ViewBoxRect } from "@/components/ViewboxExplorer/ViewboxExplorer.types";

// The four viewBox fields in attribute order, so the inputs read left to right exactly like the attribute.
const FIELDS: Array<{ key: keyof ViewBoxRect; label: string }> = [
  { key: "x", label: "min-x" },
  { key: "y", label: "min-y" },
  { key: "width", label: "width" },
  { key: "height", label: "height" }
];

// Each overlay's switch label — named for what it shows, not for the layer it draws on.
const OVERLAYS: Array<{ key: keyof OverlayToggles; label: string }> = [
  { key: "grid", label: "User-space grid" },
  { key: "outline", label: "viewBox outline" },
  { key: "borders", label: "Borders / crop" }
];

/*
  Exact-number companions to the drag: the paper size (the viewport) on two sliders, the easel
  (the viewBox) as four typed numbers, two shortcuts that undo framing in one go, and the overlay
  switches. Typing updates live and checkpoints on blur, so a three-digit number is one undo step.
*/
export default function EaselControls({ state, extent, overlays, onOverlaysChange, actions }: EaselControlsProps): JSX.Element {
  const minSize = minimumSizeFor(extent);

  // Half-typed values ("", "-") are ignored rather than clamped, so the field never fights the person typing.
  function handleNumber(key: keyof ViewBoxRect) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.valueAsNumber;
      if (!Number.isFinite(value)) return;
      actions.setViewBoxLive(clampViewBox({ ...state.viewBox, [key]: value }, extent, minSize));
    };
  }

  return (
    <>
      <SectionCard>
        <PanelTitle>Easel &amp; paper</PanelTitle>
        <Slider
          label="Paper width (viewport)"
          min={VIEWPORT_MIN}
          max={VIEWPORT_MAX}
          value={state.viewport.width}
          suffix="px"
          onChange={(width) => actions.setViewportLive({ ...state.viewport, width })}
          onCommit={actions.commitEdit}
        />
        <Slider
          label="Paper height (viewport)"
          min={VIEWPORT_MIN}
          max={VIEWPORT_MAX}
          value={state.viewport.height}
          suffix="px"
          onChange={(height) => actions.setViewportLive({ ...state.viewport, height })}
          onCommit={actions.commitEdit}
        />

        <NumberGrid role="group" aria-label="viewBox values">
          {FIELDS.map((field) => (
            <NumberField key={field.key}>
              {field.label}
              <NumberInput
                type="number"
                inputMode="decimal"
                step="any"
                min={field.key === "width" || field.key === "height" ? minSize : undefined}
                value={state.viewBox[field.key]}
                onChange={handleNumber(field.key)}
                onBlur={actions.commitEdit}
              />
            </NumberField>
          ))}
        </NumberGrid>

        <ButtonRow>
          <TimerButton type="button" onClick={actions.fitToDrawing}>
            Fit easel to drawing
          </TimerButton>
          <TimerButton type="button" onClick={actions.matchViewportRatio}>
            Match paper ratio
          </TimerButton>
        </ButtonRow>

        <ToggleRow>
          <legend>Overlays</legend>
          {OVERLAYS.map((overlay) => (
            <label key={overlay.key}>
              <input type="checkbox" checked={overlays[overlay.key]} onChange={(event) => onOverlaysChange({ ...overlays, [overlay.key]: event.target.checked })} />
              {overlay.label}
            </label>
          ))}
        </ToggleRow>
      </SectionCard>
    </>
  );
}

EaselControls.displayName = "EaselControls";
