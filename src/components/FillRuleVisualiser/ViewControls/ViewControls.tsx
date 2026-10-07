"use client";

import { useId } from "react";
import type { JSX } from "react";
import { ButtonRow, JewelButton, RangeInput, FieldLabel } from "@/components/FillRuleVisualiser/FillRuleVisualiser.styles";
import { CANVAS_SIZE, formatNumber, normaliseAngle } from "@/components/FillRuleVisualiser/FillRuleVisualiser.utils";
import { ViewBar, Toggle, SliderField, Legend, Swatch } from "@/components/FillRuleVisualiser/ViewControls/ViewControls.styles";
import type { FillRuleViewMode, ViewControlsProps } from "@/components/FillRuleVisualiser/FillRuleVisualiser.types";

// The three ways to lay the two rules on the light table, in the order the bar shows them.
const MODES: Array<{ id: FillRuleViewMode; label: string }> = [
  { id: "side", label: "Side by side" },
  { id: "split", label: "Split" },
  { id: "overlay", label: "Overlay" }
];

// Winding-map legend entries from −2 to +2; the ends stand for "this far or further".
const WINDING_LEGEND = [
  { swatch: "-2", label: "≤ −2" },
  { swatch: "-1", label: "−1" },
  { swatch: "0", label: "0 (clear)" },
  { swatch: "1", label: "+1" },
  { swatch: "2", label: "≥ +2" }
];

/*
  The strip above the light table: how the panes are laid out, which overlays are on, and a slider
  for the ray's direction (plus the seam position in split mode) so both stay keyboard-adjustable
  without hunting for the knob on the glass. The legend underneath changes with the view, since
  each view uses the glass colours to mean something slightly different.
*/
export default function ViewControls({ view, probe, actions }: ViewControlsProps): JSX.Element {
  const id = useId();
  const angle = Math.round(normaliseAngle(probe.angle));

  return (
    <>
      <ViewBar>
        <ButtonRow role="group" aria-label="Pane layout">
          {MODES.map((mode) => (
            <JewelButton key={mode.id} type="button" aria-pressed={view.mode === mode.id} onClick={() => actions.setView({ mode: mode.id })}>
              {mode.label}
            </JewelButton>
          ))}
        </ButtonRow>
        <Toggle>
          <input type="checkbox" checked={view.windingMap} onChange={(event) => actions.setView({ windingMap: event.target.checked })} />
          Winding map
        </Toggle>
        <Toggle>
          <input type="checkbox" checked={view.arrows} onChange={(event) => actions.setView({ arrows: event.target.checked })} />
          Direction arrows
        </Toggle>
        <SliderField>
          <FieldLabel htmlFor={`${id}-angle`}>
            Ray direction <output htmlFor={`${id}-angle`}>{angle}°</output>
          </FieldLabel>
          <RangeInput
            id={`${id}-angle`}
            type="range"
            min={0}
            max={355}
            step={5}
            value={angle}
            onChange={(event) => actions.setProbe({ ...probe, angle: event.target.valueAsNumber })}
          />
        </SliderField>
        {view.mode === "split" && (
          <SliderField>
            <FieldLabel htmlFor={`${id}-split`}>
              Seam position <output htmlFor={`${id}-split`}>{formatNumber(view.split)}</output>
            </FieldLabel>
            <RangeInput
              id={`${id}-split`}
              type="range"
              min={0}
              max={CANVAS_SIZE}
              step={5}
              value={view.split}
              onChange={(event) => actions.setView({ split: event.target.valueAsNumber })}
            />
          </SliderField>
        )}
        <JewelButton type="button" onClick={() => actions.setProbe({ ...probe, angle: 0 })} disabled={angle === 0}>
          Level the ray
        </JewelButton>
      </ViewBar>

      <Legend aria-label="Glass colour key">
        {view.windingMap ? (
          <>
            {WINDING_LEGEND.map((entry) => (
              <li key={entry.swatch}>
                <Swatch data-swatch={entry.swatch} aria-hidden="true" />
                winding {entry.label}
              </li>
            ))}
            <li>
              <Swatch data-swatch="clear" aria-hidden="true" />
              enclosed but empty under evenodd
            </li>
          </>
        ) : view.mode === "overlay" ? (
          <>
            <li>
              <Swatch data-swatch="evenodd" aria-hidden="true" />
              both rules fill
            </li>
            <li>
              <Swatch data-swatch="hatch" aria-hidden="true" />
              only nonzero fills
            </li>
          </>
        ) : (
          <>
            <li>
              <Swatch data-swatch="nonzero" aria-hidden="true" />
              filled under nonzero
            </li>
            <li>
              <Swatch data-swatch="evenodd" aria-hidden="true" />
              filled under evenodd
            </li>
            <li>
              <Swatch data-swatch="0" aria-hidden="true" />
              clear glass: empty
            </li>
          </>
        )}
      </Legend>
    </>
  );
}

ViewControls.displayName = "ViewControls";
