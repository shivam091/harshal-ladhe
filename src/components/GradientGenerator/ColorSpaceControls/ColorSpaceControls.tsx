import type { JSX } from "react";
import type { ColorSpaceControlsProps, GradientColorSpace, GradientHueInterpolation } from "@/interfaces/gradient";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SpaceRow, SpaceButton, HelperText } from "@/components/GradientGenerator/ColorSpaceControls/ColorSpaceControls.styles";

const SPACES: Array<{ id: GradientColorSpace; label: string }> = [
  { id: "rgb", label: "RGB" },
  { id: "hsl", label: "HSL" },
  { id: "oklch", label: "OKLCH" }
];

const HUE_MODES: GradientHueInterpolation[] = ["shorter", "longer", "increasing", "decreasing"];

// Only oklch/hsl are polar (hue is an angle) — rgb interpolates channel-by-channel and has no hue to steer, so its clause is skipped everywhere including compileGradientValue.
const POLAR_SPACES: readonly GradientColorSpace[] = ["oklch", "hsl"];

/*
  Toggles which color space the browser interpolates BETWEEN stops in — not what a stop itself
  stores (stops stay plain hex, entered via native color pickers). "RGB" compiles to CSS's `srgb`
  keyword; see COLOR_SPACE_KEYWORDS in utils/gradient.ts for why there's no literal `in rgb`.
*/
export default function ColorSpaceControls({ state, actions }: ColorSpaceControlsProps): JSX.Element {
  const isPolar = POLAR_SPACES.includes(state.colorSpace);

  return (
    <>
      <FieldWrapper>
        <FieldLabel>Color space</FieldLabel>
        <SpaceRow role="radiogroup" aria-label="Gradient interpolation color space">
          {SPACES.map((space) => (
            <SpaceButton
              key={space.id}
              type="button"
              role="radio"
              aria-checked={state.colorSpace === space.id}
              data-selected={state.colorSpace === space.id ? "true" : undefined}
              onClick={() => actions.setColorSpace(space.id)}
            >
              {space.label}
            </SpaceButton>
          ))}
        </SpaceRow>
        <HelperText>Changes how colors blend between stops, not the stop colors themselves.</HelperText>
      </FieldWrapper>

      {isPolar && (
        <FieldWrapper>
          <FieldLabel htmlFor="gradient-hue-interpolation">Hue interpolation</FieldLabel>
          <SelectWrapper>
            <SelectInput
              id="gradient-hue-interpolation"
              value={state.hueInterpolation}
              onChange={(event) => actions.setHueInterpolation(event.target.value as GradientHueInterpolation)}
            >
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

ColorSpaceControls.displayName = "ColorSpaceControls";
