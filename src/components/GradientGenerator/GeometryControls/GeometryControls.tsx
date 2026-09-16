import type { JSX } from "react";
import type { GeometryControlsProps, GradientRadialShape, GradientRadialSize } from "@/interfaces/gradient";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/GradientGenerator/GradientGenerator.styles";
import AngleDial from "@/components/GradientGenerator/AngleDial/AngleDial";
import PositionPad from "@/components/GradientGenerator/PositionPad/PositionPad";
import {
  DialRow,
  DirectionPresetRow,
  DirectionPresetButton,
  SelectField,
  SelectFieldLabel,
  SelectWrapper,
  SelectInput
} from "@/components/GradientGenerator/GeometryControls/GeometryControls.styles";

// Every value the radial shape select can be, passed through untyped from the CSS radial-gradient() spec.
const RADIAL_SHAPES: GradientRadialShape[] = ["circle", "ellipse"];
// Every value the radial size select can be, in the order the CSS spec lists them.
const RADIAL_SIZES: GradientRadialSize[] = ["closest-side", "closest-corner", "farthest-side", "farthest-corner"];

/*
  Keyword shorthand for a linear gradient's own axis — CSS's own "to <side-or-corner>" syntax has an
  exact degree equivalent for the four sides (0/90/180/270), and a widely-used diagonal approximation
  for the four corners (45/135/225/315; a true CSS "to top left" etc. actually depends on the box's
  own aspect ratio, which this tool has no notion of). These are quick presets for AngleDial's own
  angle, not a second direction model — clicking one just calls the same setAngle/commitDrag pair
  dragging the dial itself would.
*/
const DIRECTION_PRESETS: Array<{ label: string; angle: number }> = [
  { label: "Top", angle: 0 },
  { label: "Top Right", angle: 45 },
  { label: "Right", angle: 90 },
  { label: "Bottom Right", angle: 135 },
  { label: "Bottom", angle: 180 },
  { label: "Bottom Left", angle: 225 },
  { label: "Left", angle: 270 },
  { label: "Top Left", angle: 315 }
];

/*
  Renders whichever geometry inputs the current gradient type actually uses — linear only needs a
  direction dial, radial only needs the position pad (plus shape/size selects), conic needs both an
  angle dial and a position pad. Houses this tool's two flagship tactile controls (AngleDial,
  PositionPad) side by side in DialRow so a conic gradient's pair reads as one connected control
  surface rather than two unrelated widgets.
*/
export default function GeometryControls({ state, actions }: GeometryControlsProps): JSX.Element {
  const { config } = state;

  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Geometry</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <DialRow>
            {config.type === "linear" && <AngleDial angle={config.angle} onChange={actions.setAngle} onCommit={actions.commitDrag} label="Direction" />}

            {config.type === "conic" && (
              <>
                <AngleDial angle={config.angle} onChange={actions.setAngle} onCommit={actions.commitDrag} label="Start angle" />
                <PositionPad position={config.position} onChange={actions.setPosition} onCommit={actions.commitDrag} />
              </>
            )}

            {config.type === "radial" && <PositionPad position={config.position} onChange={actions.setPosition} onCommit={actions.commitDrag} />}
          </DialRow>

          {config.type === "linear" && (
            <DirectionPresetRow role="group" aria-label="Quick direction presets">
              {DIRECTION_PRESETS.map((preset) => (
                <DirectionPresetButton
                  key={preset.label}
                  type="button"
                  data-selected={config.angle === preset.angle ? "true" : undefined}
                  onClick={() => {
                    actions.setAngle(preset.angle);
                    actions.commitDrag();
                  }}
                >
                  {preset.label}
                </DirectionPresetButton>
              ))}
            </DirectionPresetRow>
          )}

          {config.type === "radial" && (
            <>
              <SelectField>
                <SelectFieldLabel htmlFor="gradient-radial-shape">Shape</SelectFieldLabel>
                <SelectWrapper>
                  <SelectInput
                    id="gradient-radial-shape"
                    value={config.shape}
                    onChange={(event) => actions.setRadialShape(event.target.value as GradientRadialShape)}
                  >
                    {RADIAL_SHAPES.map((shape) => (
                      <option key={shape} value={shape}>
                        {shape[0].toUpperCase() + shape.slice(1)}
                      </option>
                    ))}
                  </SelectInput>
                </SelectWrapper>
              </SelectField>

              <SelectField>
                <SelectFieldLabel htmlFor="gradient-radial-size">Size</SelectFieldLabel>
                <SelectWrapper>
                  <SelectInput id="gradient-radial-size" value={config.size} onChange={(event) => actions.setRadialSize(event.target.value as GradientRadialSize)}>
                    {RADIAL_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </SelectInput>
                </SelectWrapper>
              </SelectField>
            </>
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

GeometryControls.displayName = "GeometryControls";
