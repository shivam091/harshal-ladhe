import type { JSX } from "react";
import { CheckboxRow, CheckboxInput, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SectionCard, PanelTitle } from "@/components/SvgToReactConverter/SvgToReactConverter.styles";
import { OptionGroup, OptionLegend, ToggleList, SegmentRow, SegmentOption, SegmentInput } from "@/components/SvgToReactConverter/OptionsPanel/OptionsPanel.styles";
import type { OptionsPanelProps, SvgToReactOptions, ToggleFieldProps } from "@/components/SvgToReactConverter/SvgToReactConverter.types";

// Boolean switches, split into "what gets cleaned up" and "what the component accepts" so each group reads as one decision.
const TRANSFORM_TOGGLES: Array<{ key: keyof SvgToReactOptions; label: string }> = [
  { key: "camelCaseProps", label: "camelCase JSX props" },
  { key: "stripCruft", label: "Strip editor cruft" },
  { key: "inlineStyles", label: "Inline <style> classes" },
  { key: "removeDimensions", label: "Remove width/height" }
];

// Props wiring switches — each one lights its own trace on the board's bus.
const WIRING_TOGGLES: Array<{ key: keyof SvgToReactOptions; label: string }> = [
  { key: "spreadProps", label: "Spread {...props}" },
  { key: "titleProp", label: "title prop + aria-labelledby" },
  { key: "sizeProp", label: "size prop" },
  { key: "forwardRef", label: "Forward ref" },
  { key: "memo", label: "Wrap in memo" }
];

// One-of-several choices, rendered as real radio groups so arrow keys move between options natively.
const SEGMENTS = [
  {
    key: "currentColor",
    legend: "currentColor",
    choices: [
      { value: "off", label: "Off" },
      { value: "single", label: "Single colour" },
      { value: "all", label: "All colours" }
    ]
  },
  {
    key: "typescript",
    legend: "Language",
    choices: [
      { value: true, label: "TypeScript" },
      { value: false, label: "JavaScript" }
    ]
  },
  {
    key: "exportStyle",
    legend: "Export",
    choices: [
      { value: "default", label: "Default" },
      { value: "named", label: "Named" }
    ]
  },
  {
    key: "reactNative",
    legend: "Target",
    choices: [
      { value: false, label: "React DOM" },
      { value: true, label: "React Native" }
    ]
  }
] as const;

// A checkbox beside its label — DOM order keeps the input first, matching the shared DemoControlField's row-reverse layout.
function ToggleField({ id, label, checked, disabled, onChange }: ToggleFieldProps): JSX.Element {
  return (
    <>
      <CheckboxRow>
        <CheckboxInput id={id} type="checkbox" checked={checked} disabled={disabled} onChange={onChange} />
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
      </CheckboxRow>
    </>
  );
}

ToggleField.displayName = "ToggleField";

// Every pipeline toggle and output choice in one place — each change is its own undo step, since toggling is a discrete edit rather than a drag.
export default function OptionsPanel({ state, actions }: OptionsPanelProps): JSX.Element {
  const { options } = state;

  return (
    <>
      <SectionCard>
        <PanelTitle data-designator="SW1">Transforms</PanelTitle>

        <OptionGroup>
          <OptionLegend>Clean-up</OptionLegend>
          <ToggleList>
            {TRANSFORM_TOGGLES.map((toggle) => (
              <ToggleField
                key={toggle.key}
                id={`svg-to-react-${toggle.key}`}
                label={toggle.label}
                checked={Boolean(options[toggle.key])}
                onChange={(event) => actions.setOption(toggle.key, event.target.checked)}
              />
            ))}
          </ToggleList>
        </OptionGroup>

        <OptionGroup>
          <OptionLegend>Props wiring</OptionLegend>
          <ToggleList>
            {WIRING_TOGGLES.map((toggle) => (
              <ToggleField
                key={toggle.key}
                id={`svg-to-react-${toggle.key}`}
                label={toggle.label}
                checked={Boolean(options[toggle.key])}
                disabled={toggle.key === "titleProp" && options.reactNative}
                onChange={(event) => actions.setOption(toggle.key, event.target.checked)}
              />
            ))}
          </ToggleList>
        </OptionGroup>

        {SEGMENTS.map((segment) => (
          <OptionGroup key={segment.key}>
            <OptionLegend>{segment.legend}</OptionLegend>
            <SegmentRow>
              {segment.choices.map((choice) => (
                <SegmentOption key={String(choice.value)}>
                  <SegmentInput
                    type="radio"
                    name={`svg-to-react-${segment.key}`}
                    checked={options[segment.key] === choice.value}
                    onChange={() => actions.setOption(segment.key, choice.value)}
                  />
                  <span>{choice.label}</span>
                </SegmentOption>
              ))}
            </SegmentRow>
          </OptionGroup>
        ))}
      </SectionCard>
    </>
  );
}

OptionsPanel.displayName = "OptionsPanel";
