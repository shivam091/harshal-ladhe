"use client";

import type { JSX } from "react";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput, CheckboxInput, ColorInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { EASINGS } from "@/components/LineDrawingAnimator/LineDrawingAnimator.utils";
import Slider from "@/components/LineDrawingAnimator/Slider/Slider";
import { SectionCard, PanelTitle, BrassButton } from "@/components/LineDrawingAnimator/LineDrawingAnimator.styles";
import { FittingGroup, GroupLegend, InlineCheck, SeedRow, NumberInput, OverrideRow } from "@/components/LineDrawingAnimator/SettingsPanel/SettingsPanel.styles";
import type { DurationMode, EasingKey, FillFadeMode, LoopMode, SettingsPanelProps, StrokeOrderMode } from "@/components/LineDrawingAnimator/LineDrawingAnimator.types";

// The order menu, worded as a writer would think of it.
const ORDER_OPTIONS: Array<{ value: StrokeOrderMode; label: string }> = [
  { value: "document", label: "Document order" },
  { value: "reverse", label: "Reverse document order" },
  { value: "left-right", label: "Left → right" },
  { value: "top-bottom", label: "Top → bottom" },
  { value: "longest", label: "Longest first" },
  { value: "random", label: "Random (seeded)" },
  { value: "custom", label: "Custom (from the ledger)" }
];

// When filled shapes ink in.
const FILL_OPTIONS: Array<{ value: FillFadeMode; label: string }> = [
  { value: "off", label: "Show fills throughout" },
  { value: "each", label: "Fade in after each outline" },
  { value: "end", label: "Fade in once the pen lifts" }
];

// Playback repetition.
const LOOP_OPTIONS: Array<{ value: LoopMode; label: string }> = [
  { value: "once", label: "Play once" },
  { value: "loop", label: "Loop" },
  { value: "yoyo", label: "Yoyo (write, then unwrite)" }
];

/*
  Every animation-wide setting, grouped into brass fitting plates. Sliders update live and
  checkpoint on release; selects and checkboxes are single discrete edits, so they commit at once.
*/
export default function SettingsPanel({ settings, actions }: SettingsPanelProps): JSX.Element {
  return (
    <>
      <SectionCard aria-labelledby="ld-settings-title">
        <PanelTitle id="ld-settings-title">Desk fittings</PanelTitle>

        <FittingGroup>
          <GroupLegend>Order</GroupLegend>
          <FieldWrapper>
            <FieldLabel htmlFor="ld-order">Stroke order</FieldLabel>
            <SelectWrapper>
              <SelectInput id="ld-order" value={settings.order} onChange={(event) => actions.setSetting("order", event.target.value as StrokeOrderMode)}>
                {ORDER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
          {settings.order === "random" && (
            <FieldWrapper>
              <FieldLabel htmlFor="ld-seed">Shuffle seed</FieldLabel>
              <SeedRow>
                <NumberInput
                  id="ld-seed"
                  type="number"
                  min={0}
                  max={999999}
                  value={settings.seed}
                  onChange={(event) => {
                    if (Number.isFinite(event.target.valueAsNumber)) actions.setSetting("seed", Math.max(0, Math.round(event.target.valueAsNumber)));
                  }}
                />
                <BrassButton type="button" onClick={() => actions.setSetting("seed", Math.floor(Math.random() * 999999))}>
                  Reshuffle
                </BrassButton>
              </SeedRow>
            </FieldWrapper>
          )}
        </FittingGroup>

        <FittingGroup>
          <GroupLegend>Pacing</GroupLegend>
          <FieldWrapper>
            <FieldLabel htmlFor="ld-duration-mode">Stroke duration</FieldLabel>
            <SelectWrapper>
              <SelectInput id="ld-duration-mode" value={settings.durationMode} onChange={(event) => actions.setSetting("durationMode", event.target.value as DurationMode)}>
                <option value="fixed">Fixed per stroke</option>
                <option value="proportional">Signature (constant pen speed)</option>
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
          {settings.durationMode === "fixed" ? (
            <Slider id="ld-duration" label="Per stroke" min={100} max={4000} step={50} value={settings.duration} suffix="ms" onChange={(value) => actions.setSettingLive("duration", value)} onCommit={actions.commitEdit} />
          ) : (
            <Slider id="ld-speed" label="Pen speed (units per second)" min={50} max={2000} step={10} value={settings.speed} onChange={(value) => actions.setSettingLive("speed", value)} onCommit={actions.commitEdit} />
          )}
          <Slider id="ld-stagger" label="Pen-lift pause" min={0} max={1500} step={10} value={settings.stagger} suffix="ms" onChange={(value) => actions.setSettingLive("stagger", value)} onCommit={actions.commitEdit} />
          <Slider id="ld-overlap" label="Overlap" min={0} max={100} step={1} value={settings.overlap} suffix="%" onChange={(value) => actions.setSettingLive("overlap", value)} onCommit={actions.commitEdit} />
          <FieldWrapper>
            <FieldLabel htmlFor="ld-easing">Easing</FieldLabel>
            <SelectWrapper>
              <SelectInput id="ld-easing" value={settings.easing} onChange={(event) => actions.setSetting("easing", event.target.value as EasingKey)}>
                {EASINGS.map((easing) => (
                  <option key={easing.key} value={easing.key}>
                    {easing.label}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
        </FittingGroup>

        <FittingGroup>
          <GroupLegend>Pen</GroupLegend>
          <FieldWrapper>
            <FieldLabel htmlFor="ld-colour">Stroke colour</FieldLabel>
            <OverrideRow>
              <InlineCheck>
                <CheckboxInput type="checkbox" checked={settings.overrideColour} onChange={(event) => actions.setSetting("overrideColour", event.target.checked)} />
                Override
              </InlineCheck>
              <ColorInput
                id="ld-colour"
                type="color"
                disabled={!settings.overrideColour}
                value={settings.strokeColour}
                onChange={(event) => actions.setSettingLive("strokeColour", event.target.value)}
                onBlur={actions.commitEdit}
              />
            </OverrideRow>
          </FieldWrapper>
          <FieldWrapper>
            <InlineCheck>
              <CheckboxInput type="checkbox" checked={settings.overrideWidth} onChange={(event) => actions.setSetting("overrideWidth", event.target.checked)} />
              Override stroke width
            </InlineCheck>
          </FieldWrapper>
          {settings.overrideWidth && (
            <Slider id="ld-width" label="Stroke width" min={0.5} max={16} step={0.25} value={settings.strokeWidth} onChange={(value) => actions.setSettingLive("strokeWidth", value)} onCommit={actions.commitEdit} />
          )}
        </FittingGroup>

        <FittingGroup>
          <GroupLegend>Fills</GroupLegend>
          <FieldWrapper>
            <InlineCheck>
              <CheckboxInput type="checkbox" checked={settings.outlineFills} onChange={(event) => actions.setSetting("outlineFills", event.target.checked)} />
              Draw fill-only shapes as outlines
            </InlineCheck>
          </FieldWrapper>
          <FieldWrapper>
            <FieldLabel htmlFor="ld-fill-fade">Fill fade-in</FieldLabel>
            <SelectWrapper>
              <SelectInput id="ld-fill-fade" value={settings.fillFade} onChange={(event) => actions.setSetting("fillFade", event.target.value as FillFadeMode)}>
                {FILL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
          {settings.fillFade !== "off" && (
            <Slider id="ld-fill-duration" label="Fade length" min={50} max={3000} step={50} value={settings.fillDuration} suffix="ms" onChange={(value) => actions.setSettingLive("fillDuration", value)} onCommit={actions.commitEdit} />
          )}
        </FittingGroup>

        <FittingGroup>
          <GroupLegend>Playback &amp; export</GroupLegend>
          <FieldWrapper>
            <FieldLabel htmlFor="ld-loop">Repeat</FieldLabel>
            <SelectWrapper>
              <SelectInput id="ld-loop" value={settings.loop} onChange={(event) => actions.setSetting("loop", event.target.value as LoopMode)}>
                {LOOP_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
          {settings.loop !== "once" && (
            <Slider id="ld-hold" label="Hold the finished page" min={0} max={5000} step={50} value={settings.hold} suffix="ms" onChange={(value) => actions.setSettingLive("hold", value)} onCommit={actions.commitEdit} />
          )}
          <FieldWrapper>
            <InlineCheck>
              <CheckboxInput type="checkbox" checked={settings.normalise} onChange={(event) => actions.setSetting("normalise", event.target.checked)} />
              Normalise with pathLength=&quot;1&quot;
            </InlineCheck>
          </FieldWrapper>
        </FittingGroup>
      </SectionCard>
    </>
  );
}

SettingsPanel.displayName = "SettingsPanel";
