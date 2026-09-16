import type { JSX } from "react";
import type { ColorSpaceControlsProps, GradientColorSpace, GradientHueInterpolation } from "@/interfaces/gradient";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/GradientGenerator/GradientGenerator.styles";
import { SelectField, SelectFieldLabel, SelectWrapper, SelectInput } from "@/components/GradientGenerator/GeometryControls/GeometryControls.styles";
import { SpaceRow, SpaceButton, HelperText } from "@/components/GradientGenerator/ColorSpaceControls/ColorSpaceControls.styles";

// The three interpolation methods this editor exposes, in the order the radio group renders them.
const SPACES: Array<{ id: GradientColorSpace; label: string }> = [
  { id: "rgb", label: "RGB" },
  { id: "hsl", label: "HSL" },
  { id: "oklch", label: "OKLCH" }
];

// Every hue-travel direction the hue-interpolation select offers — only shown for the two polar spaces below.
const HUE_MODES: GradientHueInterpolation[] = ["shorter", "longer", "increasing", "decreasing"];

// Only oklch/hsl are polar (hue is an angle) — rgb interpolates channel-by-channel and has no hue to steer, so its clause is skipped everywhere including compileGradientValue.
const POLAR_SPACES: readonly GradientColorSpace[] = ["oklch", "hsl"];

/*
  Toggles which color space the browser interpolates BETWEEN stops in — not what a stop itself
  stores (stops stay plain hex, entered via native color pickers in StopEditor). "RGB" compiles to
  CSS's `srgb` keyword; see COLOR_SPACE_KEYWORDS in utils/gradient.ts for why there's no literal `in rgb`.
*/
export default function ColorSpaceControls({ state, actions }: ColorSpaceControlsProps): JSX.Element {
  const isPolar = POLAR_SPACES.includes(state.colorSpace);

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Color space</PanelTitle>
        </PanelHeader>
        <PanelBody>
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

          {isPolar && (
            <SelectField>
              <SelectFieldLabel htmlFor="gradient-hue-interpolation">Hue interpolation</SelectFieldLabel>
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
            </SelectField>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

ColorSpaceControls.displayName = "ColorSpaceControls";
