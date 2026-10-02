"use client";

import { useState } from "react";
import type { JSX } from "react";
import type { SvgDemoValue, SvgDemoValues } from "@/data/svg-demos";
import type { PlaygroundState } from "@/components/mdx/ZIndexPlayground/ZIndexPlayground.types";
import DemoControlField from "@/components/InteractiveSvgPanel/DemoControlField";
import LiveCode from "@/components/LiveCode";
import { PanelWrapper, PanelHeader, ControlsForm } from "@/components/InteractiveSvgPanel/InteractiveSvgPanel.styles";
import { DemoVerdict } from "@/components/mdx/common.styles";
import { CONTROLS, TRIGGER_STYLES } from "@/components/mdx/ZIndexPlayground/ZIndexPlayground.constants";
import { resolveVerdict, buildCss } from "@/components/mdx/ZIndexPlayground/ZIndexPlayground.helpers";
import {
  Stage,
  CardA,
  CardB,
  Tooltip,
  CardTitle,
  CardCode,
  TooltipCode
} from "@/components/mdx/ZIndexPlayground/ZIndexPlayground.styles";

// Seeds every control from its registry default, so the stage and the controls can't start out of sync.
function getDefaultValues(): SvgDemoValues {
  return Object.fromEntries(CONTROLS.map((control) => [control.id, control.defaultValue]));
}

// Converts `auto` to the value React expects for an inline z-index, keeping numbers as numbers.
function toZIndex(value: string): number | "auto" {
  return value === "auto" ? "auto" : Number(value);
}

/*
  The "z-index: 9999 doesn't work" bug, live. Every box is real DOM with real CSS, so the browser — not a picture of
  the browser — decides what paints on top, and the readout explains that decision with the same rules.
*/
export default function ZIndexPlayground(): JSX.Element {
  const [values, setValues] = useState<SvgDemoValues>(getDefaultValues);

  const state: PlaygroundState = {
    cardAZ: String(values.cardAZ),
    trigger: String(values.trigger),
    tooltipZ: Number(values.tooltipZ),
    cardBZ: String(values.cardBZ)
  };
  const verdict = resolveVerdict(state);

  // Replaces one control's value while keeping the others, matching DemoControlField's callback shape.
  function handleChange(id: string, value: SvgDemoValue): void {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <>
      <PanelWrapper>
        <PanelHeader>z-index playground: can the tooltip escape Card A?</PanelHeader>
        <ControlsForm>
          {CONTROLS.map((control) => (
            <DemoControlField key={control.id} control={control} value={values[control.id]} values={values} onChange={handleChange} />
          ))}
        </ControlsForm>

        <Stage aria-hidden="true">
          <CardA style={{ zIndex: toZIndex(state.cardAZ), ...TRIGGER_STYLES[state.trigger] }}>
            <CardTitle>Card A</CardTitle>
            <CardCode>z-index: {state.cardAZ}</CardCode>
            <Tooltip style={{ zIndex: state.tooltipZ }}>
              Tooltip
              <TooltipCode>z-index: {state.tooltipZ}</TooltipCode>
            </Tooltip>
          </CardA>
          <CardB style={{ zIndex: toZIndex(state.cardBZ) }}>
            <CardTitle>Card B</CardTitle>
            <CardCode>z-index: {state.cardBZ}</CardCode>
          </CardB>
        </Stage>

        <DemoVerdict aria-live="polite" data-outcome={verdict.tooltipOnTop ? "good" : "bad"}>
          <strong>{verdict.tooltipOnTop ? "Tooltip on top." : "Tooltip hidden."}</strong> {verdict.explanation}
        </DemoVerdict>

        <LiveCode code={buildCss(state)} language="css" label="Live CSS for the z-index playground" />
      </PanelWrapper>
    </>
  );
}

ZIndexPlayground.displayName = "ZIndexPlayground";
