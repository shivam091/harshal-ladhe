import type { JSX } from "react";
import type { GeometryControlsProps, GradientRadialShape, GradientRadialSize } from "@/interfaces/gradient";
import { FieldWrapper, FieldLabel, SelectWrapper, SelectInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import AngleDial from "@/components/GradientGenerator/AngleDial/AngleDial";
import PositionPad from "@/components/GradientGenerator/PositionPad/PositionPad";
import { GeometryRow } from "@/components/GradientGenerator/GeometryControls/GeometryControls.styles";

const RADIAL_SHAPES: GradientRadialShape[] = ["circle", "ellipse"];
const RADIAL_SIZES: GradientRadialSize[] = ["closest-side", "closest-corner", "farthest-side", "farthest-corner"];

/*
  Renders whichever geometry inputs the current gradient type actually uses — linear only needs a
  direction, radial only needs a position (plus shape/size), conic needs both an angle and a
  position. Grouped in one component (rather than branching inside GradientGenerator itself) to
  mirror ShapeControls' own per-family conditional rendering in the clip-path tool.
*/
export default function GeometryControls({ state, actions }: GeometryControlsProps): JSX.Element {
  const { config } = state;

  return (
    <>
      <GeometryRow>
        {config.type === "linear" && <AngleDial angle={config.angle} onChange={actions.setAngle} onCommit={actions.commitDrag} label="Direction" />}

        {config.type === "conic" && (
          <>
            <AngleDial angle={config.angle} onChange={actions.setAngle} onCommit={actions.commitDrag} label="Start angle" />
            <PositionPad position={config.position} onChange={actions.setPosition} onCommit={actions.commitDrag} />
          </>
        )}

        {config.type === "radial" && <PositionPad position={config.position} onChange={actions.setPosition} onCommit={actions.commitDrag} />}
      </GeometryRow>

      {config.type === "radial" && (
        <>
          <FieldWrapper>
            <FieldLabel htmlFor="gradient-radial-shape">Shape</FieldLabel>
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
          </FieldWrapper>

          <FieldWrapper>
            <FieldLabel htmlFor="gradient-radial-size">Size</FieldLabel>
            <SelectWrapper>
              <SelectInput id="gradient-radial-size" value={config.size} onChange={(event) => actions.setRadialSize(event.target.value as GradientRadialSize)}>
                {RADIAL_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </SelectInput>
            </SelectWrapper>
          </FieldWrapper>
        </>
      )}
    </>
  );
}

GeometryControls.displayName = "GeometryControls";
