"use client";

import { useState } from "react";
import type { JSX } from "react";
import type { SvgDemoValue, SvgDemoValues } from "@/data/svg-demos";
import DemoControlField from "@/components/InteractiveSvgPanel/DemoControlField";
import LiveCode from "@/components/LiveCode";
import { PanelWrapper, PanelHeader, ControlsForm } from "@/components/InteractiveSvgPanel/InteractiveSvgPanel.styles";
import { DemoVerdict } from "@/components/mdx/common.styles";
import { CONTROLS, PARENT_STYLES } from "@/components/mdx/NegativeZIndexDemo/NegativeZIndexDemo.constants";
import { describeOutcome, buildCss } from "@/components/mdx/NegativeZIndexDemo/NegativeZIndexDemo.helpers";
import { Stage, Parent, Decoration, Spacer } from "@/components/mdx/NegativeZIndexDemo/NegativeZIndexDemo.styles";

// Seeds the control from its registry default, so the stage and the select can't start out of sync.
function getDefaultValues(): SvgDemoValues {
  return Object.fromEntries(CONTROLS.map((control) => [control.id, control.defaultValue]));
}

/*
  Where does z-index: -1 actually go? Real DOM, real CSS: switching the parent between z-index: auto, z-index: 0,
  and isolation: isolate shows the child vanishing behind the parent, then reappearing between its background and text.
*/
export default function NegativeZIndexDemo(): JSX.Element {
  const [values, setValues] = useState<SvgDemoValues>(getDefaultValues);
  const parentStyle = String(values.negativeParent);
  const outcome = describeOutcome(parentStyle);

  // Replaces the control's value, matching DemoControlField's callback shape.
  function handleChange(id: string, value: SvgDemoValue): void {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <>
      <PanelWrapper>
        <PanelHeader>Where does z-index: -1 go?</PanelHeader>
        <ControlsForm>
          {CONTROLS.map((control) => (
            <DemoControlField key={control.id} control={control} value={values[control.id]} values={values} onChange={handleChange} />
          ))}
        </ControlsForm>

        <Stage aria-hidden="true">
          <Parent style={PARENT_STYLES[parentStyle]}>
            <strong>Parent</strong> — this text is in-flow content, so it always paints above a negative layer of the
            same stacking context.
            <Decoration>z-index: -1</Decoration>
          </Parent>
          <Spacer />
        </Stage>

        <DemoVerdict aria-live="polite" data-outcome={outcome.contained ? "good" : "bad"}>
          <strong>{outcome.contained ? "Contained by the parent." : "Escaped behind the parent."}</strong> {outcome.explanation}
        </DemoVerdict>

        <LiveCode code={buildCss(parentStyle)} language="css" label="Live CSS for the negative z-index demo" />
      </PanelWrapper>
    </>
  );
}

NegativeZIndexDemo.displayName = "NegativeZIndexDemo";
