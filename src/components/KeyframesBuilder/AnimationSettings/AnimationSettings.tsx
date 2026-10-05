import type { JSX } from "react";
import { TIMING_FUNCTIONS, formatTime, sanitiseAnimationName } from "@/utils/keyframes-builder";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/KeyframesBuilder/Slider/Slider";
import { SectionCard, PanelTitle } from "@/components/KeyframesBuilder/KeyframesBuilder.styles";
import { TextInput, NameHint, FieldPair, IterationRow, InlineCheckLabel } from "@/components/KeyframesBuilder/AnimationSettings/AnimationSettings.styles";
import type { AnimationDirection, AnimationFillMode, AnimationSettingsProps } from "@/components/KeyframesBuilder/KeyframesBuilder.types";

// The four directions, typed so the select can only hand back a valid keyword.
const DIRECTIONS: AnimationDirection[] = ["normal", "reverse", "alternate", "alternate-reverse"];

// The four fill modes, typed for the same reason.
const FILL_MODES: AnimationFillMode[] = ["none", "forwards", "backwards", "both"];

// What a finite iteration count falls back to when "infinite" is switched off — one run is CSS's own default.
const DEFAULT_FINITE_ITERATIONS = 1;

/*
  Everything the `animation` shorthand carries besides the keyframes. Continuous controls (the name
  field, the sliders) stream live and checkpoint on release/blur; the discrete ones (selects,
  checkbox) record their own undo step straight away.
*/
export default function AnimationSettings({ state, actions }: AnimationSettingsProps): JSX.Element {
  const { settings } = state;
  const sanitisedName = sanitiseAnimationName(settings.name);
  const isInfinite = settings.iterationCount === "infinite";

  return (
    <>
      <SectionCard aria-labelledby="keyframes-settings-title">
        <PanelTitle id="keyframes-settings-title">Animation</PanelTitle>

        <FieldWrapper>
          <FieldLabel htmlFor="kfb-name">Name</FieldLabel>
          <TextInput
            id="kfb-name"
            type="text"
            spellCheck={false}
            autoComplete="off"
            maxLength={64}
            value={settings.name}
            onChange={(event) => actions.setSettingLive("name", event.target.value)}
            onBlur={actions.commitDrag}
          />
          {sanitisedName !== settings.name && (
            <NameHint>
              Exported as <code>{sanitisedName}</code>
            </NameHint>
          )}
        </FieldWrapper>

        <Slider
          id="kfb-duration"
          label="Duration"
          min={100}
          max={5000}
          step={50}
          value={settings.durationMs}
          format={formatTime}
          onChange={(value) => actions.setSettingLive("durationMs", value)}
          onCommit={actions.commitDrag}
        />
        <Slider
          id="kfb-delay"
          label="Delay"
          min={0}
          max={3000}
          step={50}
          value={settings.delayMs}
          format={formatTime}
          onChange={(value) => actions.setSettingLive("delayMs", value)}
          onCommit={actions.commitDrag}
        />

        <FieldWrapper>
          <FieldLabel htmlFor="kfb-timing">Timing function</FieldLabel>
          <SelectWrapper>
            <SelectInput id="kfb-timing" value={settings.timingFunction} onChange={(event) => actions.setSetting("timingFunction", event.target.value)}>
              {TIMING_FUNCTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>

        <FieldWrapper>
          <FieldLabel htmlFor="kfb-iterations">Iteration count</FieldLabel>
          <IterationRow>
            <TextInput
              id="kfb-iterations"
              type="number"
              min={1}
              max={99}
              disabled={isInfinite}
              value={isInfinite ? "" : settings.iterationCount}
              placeholder={isInfinite ? "∞" : undefined}
              onChange={(event) => {
                const next = event.target.valueAsNumber;
                if (Number.isFinite(next)) actions.setSetting("iterationCount", Math.min(99, Math.max(1, Math.round(next))));
              }}
            />
            <InlineCheckLabel>
              <CheckboxInput
                type="checkbox"
                checked={isInfinite}
                onChange={(event) => actions.setSetting("iterationCount", event.target.checked ? "infinite" : DEFAULT_FINITE_ITERATIONS)}
              />
              infinite
            </InlineCheckLabel>
          </IterationRow>
        </FieldWrapper>

        <FieldPair>
          <FieldWrapper>
            <FieldLabel htmlFor="kfb-direction">Direction</FieldLabel>
            <SelectWrapper>
              <SelectInput id="kfb-direction" value={settings.direction} onChange={(event) => actions.setSetting("direction", event.target.value as AnimationDirection)}>
                {DIRECTIONS.map((direction) => (
                  <option key={direction} value={direction}>
                    {direction}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel htmlFor="kfb-fill">Fill mode</FieldLabel>
            <SelectWrapper>
              <SelectInput id="kfb-fill" value={settings.fillMode} onChange={(event) => actions.setSetting("fillMode", event.target.value as AnimationFillMode)}>
                {FILL_MODES.map((fillMode) => (
                  <option key={fillMode} value={fillMode}>
                    {fillMode}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
        </FieldPair>
      </SectionCard>
    </>
  );
}

AnimationSettings.displayName = "AnimationSettings";
