import type { JSX } from "react";
import type { ColorMixHueMethod, SpaceControlsProps } from "@/interfaces/color-mix";
import { POLAR_SPACES, SPACES } from "@/helpers/color-mix-editor";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SpaceRow, SpaceButton, HelperText } from "@/components/ColorMixPlayground/SpaceControls/SpaceControls.styles";

// Display labels for the 7 curated spaces — capitalization CSS itself doesn't care about, but a reader scanning the row does.
const SPACE_LABELS: Record<(typeof SPACES)[number], string> = {
  srgb: "sRGB",
  lab: "Lab",
  oklab: "OKLab",
  hsl: "HSL",
  hwb: "HWB",
  lch: "LCH",
  oklch: "OKLCH"
};

const HUE_MODES: ColorMixHueMethod[] = ["shorter", "longer", "increasing", "decreasing"];

/*
  Toggles which color space color-mix() interpolates the two colors IN — not what the colors
  themselves are (those stay plain hex, entered via HexColorField). More than double
  GradientGenerator's own 3-option ColorSpaceControls, so this one wraps instead of giving every
  button an equal flex share.
*/
export default function SpaceControls({ state, actions }: SpaceControlsProps): JSX.Element {
  const isPolar = POLAR_SPACES.includes(state.space);

  return (
    <>
      <FieldWrapper>
        <FieldLabel>Color space</FieldLabel>
        <SpaceRow role="radiogroup" aria-label="color-mix() interpolation color space">
          {SPACES.map((space) => (
            <SpaceButton
              key={space}
              type="button"
              role="radio"
              aria-checked={state.space === space}
              data-selected={state.space === space ? "true" : undefined}
              onClick={() => actions.setSpace(space)}
            >
              {SPACE_LABELS[space]}
            </SpaceButton>
          ))}
        </SpaceRow>
        <HelperText>Changes how the two colors interpolate, not the colors themselves.</HelperText>
      </FieldWrapper>

      {isPolar && (
        <FieldWrapper>
          <FieldLabel htmlFor="color-mix-hue-method">Hue interpolation</FieldLabel>
          <SelectWrapper>
            <SelectInput id="color-mix-hue-method" value={state.hueMethod} onChange={(event) => actions.setHueMethod(event.target.value as ColorMixHueMethod)}>
              {HUE_MODES.map((mode) => (
                <option key={mode} value={mode}>
                  {mode[0].toUpperCase() + mode.slice(1)} hue
                </option>
              ))}
            </SelectInput>
          </SelectWrapper>
        </FieldWrapper>
      )}
    </>
  );
}

SpaceControls.displayName = "SpaceControls";
