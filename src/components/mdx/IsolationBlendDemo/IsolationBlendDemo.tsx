"use client";

import { useState } from "react";
import type { CSSProperties, JSX } from "react";
import type { SvgDemoValue, SvgDemoValues } from "@/data/svg-demos";
import DemoControlField from "@/components/InteractiveSvgPanel/DemoControlField";
import LiveCode from "@/components/LiveCode";
import { PanelWrapper, PanelHeader, ControlsForm } from "@/components/InteractiveSvgPanel/InteractiveSvgPanel.styles";
import { DemoVerdict } from "@/components/mdx/common.styles";
import { CIRCLE_COLORS, CONTROLS } from "@/components/mdx/IsolationBlendDemo/IsolationBlendDemo.constants";
import { describeOutcome, buildCss } from "@/components/mdx/IsolationBlendDemo/IsolationBlendDemo.helpers";
import { Stage, Group, Circle } from "@/components/mdx/IsolationBlendDemo/IsolationBlendDemo.styles";

// Top-left offsets that make the three circles overlap in a Venn pattern, so every pairwise blend is visible.
const CIRCLE_POSITIONS = [
  { top: "0rem", left: "0.5rem" },
  { top: "0rem", left: "5rem" },
  { top: "3rem", left: "2.75rem" }
];

// Seeds every control from its registry default, so the stage and the selects can't start out of sync.
function getDefaultValues(): SvgDemoValues {
  return Object.fromEntries(CONTROLS.map((control) => [control.id, control.defaultValue]));
}

/*
  isolation's original job: keeping mix-blend-mode inside a group. Real DOM and real blending, so the reader sees the
  browser's actual compositing rather than an illustration of it.
*/
export default function IsolationBlendDemo(): JSX.Element {
  const [values, setValues] = useState<SvgDemoValues>(getDefaultValues);
  const isolation = String(values.groupIsolation);
  const blendMode = String(values.blendMode);
  const outcome = describeOutcome(isolation, blendMode);

  // Replaces one control's value while keeping the other, matching DemoControlField's callback shape.
  function handleChange(id: string, value: SvgDemoValue): void {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <>
      <PanelWrapper>
        <PanelHeader>Containing mix-blend-mode with isolation</PanelHeader>
        <ControlsForm>
          {CONTROLS.map((control) => (
            <DemoControlField key={control.id} control={control} value={values[control.id]} values={values} onChange={handleChange} />
          ))}
        </ControlsForm>

        <Stage aria-hidden="true">
          <Group style={{ isolation } as CSSProperties}>
            {CIRCLE_COLORS.map((color, index) => (
              <Circle
                key={color}
                style={{
                  "--top": CIRCLE_POSITIONS[index].top,
                  "--left": CIRCLE_POSITIONS[index].left,
                  "--fill": color,
                  mixBlendMode: blendMode
                } as CSSProperties}
              />
            ))}
          </Group>
        </Stage>

        <DemoVerdict aria-live="polite" data-outcome={outcome.isolated ? "good" : "bad"}>
          <strong>{outcome.isolated ? "Blending stays inside the group." : "Blending leaks into the stripes."}</strong> {outcome.explanation}
        </DemoVerdict>

        <LiveCode code={buildCss(isolation, blendMode)} language="css" label="Live CSS for the isolation and blend-mode demo" />
      </PanelWrapper>
    </>
  );
}

IsolationBlendDemo.displayName = "IsolationBlendDemo";
