import type { JSX } from "react";
import type { BehaviorControlsProps, PopoverContent, PopoverMode } from "@/interfaces/popover-anchor-builder";
import { fallbackValueFor } from "@/utils/popover-anchor-builder";
import { FieldWrapper, FieldLabel, CheckboxInput, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SegmentRow, SegmentButton } from "@/components/PopoverAnchorBuilder/BehaviorControls/BehaviorControls.styles";
import { FieldCaption } from "@/components/PopoverAnchorBuilder/PopoverAnchorBuilder.styles";

const MODES: Array<{ value: PopoverMode; label: string }> = [
  { value: "auto", label: "Auto" },
  { value: "manual", label: "Manual" }
];

const CONTENTS: Array<{ value: PopoverContent; label: string }> = [
  { value: "text", label: "Text" },
  { value: "menu", label: "Menu" },
  { value: "dialog", label: "Dialog" }
];

// Every non-placement toggle: light-dismiss mode, the dimming backdrop, the fade/scale entrance, whether a viewport-overflow fallback is included, and what kind of content the popover previews — each gated behind its own explanatory caption where the label alone wouldn't make the effect obvious.
export default function BehaviorControls({ state, actions }: BehaviorControlsProps): JSX.Element {
  const fallbackValue = fallbackValueFor(state.anchorSide);

  return (
    <>
      <FieldWrapper>
        <FieldLabel>Popover mode</FieldLabel>
        <SegmentRow role="tablist" aria-label="Popover mode">
          {MODES.map((mode) => (
            <SegmentButton
              key={mode.value}
              type="button"
              role="tab"
              aria-selected={state.mode === mode.value}
              data-selected={state.mode === mode.value ? "true" : undefined}
              onClick={() => actions.setMode(mode.value)}
            >
              {mode.label}
            </SegmentButton>
          ))}
        </SegmentRow>
        <FieldCaption>
          {state.mode === "auto" ? "Light-dismisses on an outside click or Esc." : "Only closes via an explicit close control."}
        </FieldCaption>
      </FieldWrapper>

      <FieldWrapper data-inline="true">
        <FieldLabel htmlFor="pab-backdrop">Backdrop</FieldLabel>
        <CheckboxInput
          id="pab-backdrop"
          type="checkbox"
          checked={state.backdrop}
          onChange={(event) => actions.setBackdrop(event.target.checked)}
        />
      </FieldWrapper>
      <FieldCaption>Dims the page behind the popover via `::backdrop` — only visible while it&apos;s open.</FieldCaption>

      <FieldWrapper data-inline="true">
        <FieldLabel htmlFor="pab-entrance-animation">Entrance animation</FieldLabel>
        <CheckboxInput
          id="pab-entrance-animation"
          type="checkbox"
          checked={state.entranceAnimation}
          onChange={(event) => actions.setEntranceAnimation(event.target.checked)}
        />
      </FieldWrapper>
      <FieldCaption>{state.entranceAnimation ? "Fades and scales in via @starting-style." : "Pops open instantly, no transition."}</FieldCaption>

      <FieldWrapper data-inline="true">
        <FieldLabel htmlFor="pab-fallback">Fallback position</FieldLabel>
        <CheckboxInput
          id="pab-fallback"
          type="checkbox"
          checked={state.fallback}
          disabled={!fallbackValue}
          onChange={(event) => actions.setFallback(event.target.checked)}
        />
      </FieldWrapper>
      <FieldCaption>
        {fallbackValue
          ? `Adds position-try-fallbacks: ${fallbackValue} — flips to the opposite side if this one would overflow the viewport.`
          : "No opposite side to flip to while centered — this toggle has no effect."}
      </FieldCaption>

      <FieldWrapper>
        <FieldLabel htmlFor="pab-content">Popover content</FieldLabel>
        <SelectWrapper>
          <SelectInput id="pab-content" value={state.content} onChange={(event) => actions.setContent(event.target.value as PopoverContent)}>
            {CONTENTS.map((content) => (
              <option key={content.value} value={content.value}>
                {content.label}
              </option>
            ))}
          </SelectInput>
        </SelectWrapper>
      </FieldWrapper>
    </>
  );
}

BehaviorControls.displayName = "BehaviorControls";
