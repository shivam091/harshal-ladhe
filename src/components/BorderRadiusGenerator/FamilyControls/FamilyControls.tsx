import type { CSSProperties, JSX } from "react";
import { compileBlobValue } from "@/utils/border-radius";
import { CORNER_NAMES } from "@/interfaces/border-radius";
import type { CornerName, CornerRadius, FamilyControlsProps, FamilyShape } from "@/interfaces/border-radius";
import { FieldWrapper, FieldLabel, CheckboxInput } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import Slider from "@/components/BorderRadiusGenerator/Slider/Slider";
import { Panel, PanelHeader, PanelTitle, PanelBody } from "@/components/BorderRadiusGenerator/BorderRadiusGenerator.styles";
import { LumpRow, LumpButton, LumpStage, LumpSwatch, LumpLabel, UniformRow } from "@/components/BorderRadiusGenerator/FamilyControls/FamilyControls.styles";

// Shorthand for a symmetric fraction-of-size corner map — most quick shapes round every corner by the same amount.
function uniformFraction(value: number): Record<CornerName, CornerRadius> {
  const corner: CornerRadius = { h: value, v: value };
  return { topLeft: corner, topRight: corner, bottomRight: corner, bottomLeft: corner };
}

// One clay-lump swatch: the recipe FamilyControls hands to actions.applyFamilyShape, plus how big to render its own preview stage — a wide rectangle for Pill, a square for everything else, which is what actually makes Pill and Circle read as different shapes despite both clamping to the same "half the box" radius.
interface FamilyShapeOption extends FamilyShape {
  previewWidth: string;
  previewHeight: string;
}

// Reference size (px) the preview swatches compile their border-radius/clip-path against — arbitrary, just needs to be big enough that compileBlobValue's clamping/sampling behaves the same as it would at any real editor size.
const PREVIEW_SIZE = 32;

/*
  The tool's flagship "quick shape" flourish — six named silhouettes spanning the full sharp-to-blob
  range this tool is about, each a fraction-of-size corner recipe (see FamilyShape's own comment)
  rather than a fixed px value so it scales to whatever size lump is already on the stand. Distinct
  from BorderRadiusPresetMeta's full presets (data/border-radius-presets.ts): a preset also swaps
  colors and size; a family shape only ever restyles the corners.
*/
const FAMILY_SHAPES: FamilyShapeOption[] = [
  { id: "sharp", label: "Sharp", family: "rounded", curvature: 4, uniform: true, corners: uniformFraction(0), previewWidth: "2rem", previewHeight: "2rem" },
  { id: "rounded", label: "Rounded", family: "rounded", curvature: 4, uniform: true, corners: uniformFraction(0.18), previewWidth: "2rem", previewHeight: "2rem" },
  { id: "pill", label: "Pill", family: "rounded", curvature: 4, uniform: true, corners: uniformFraction(1), previewWidth: "2.75rem", previewHeight: "1.5rem" },
  { id: "circle", label: "Circle", family: "rounded", curvature: 4, uniform: true, corners: uniformFraction(0.5), previewWidth: "2rem", previewHeight: "2rem" },
  {
    id: "blob",
    label: "Blob",
    family: "rounded",
    curvature: 4,
    uniform: false,
    corners: { topLeft: { h: 0.5, v: 0.7 }, topRight: { h: 0.7, v: 0.35 }, bottomRight: { h: 0.35, v: 0.55 }, bottomLeft: { h: 0.6, v: 0.4 } },
    previewWidth: "2rem",
    previewHeight: "2rem"
  },
  { id: "squircle", label: "Squircle", family: "squircle", curvature: 6, uniform: true, corners: uniformFraction(0.35), previewWidth: "2rem", previewHeight: "2rem" }
];

// Compiles a shape's own preview border-radius/clip-path the exact same way the real lump on the modeling stand does — the swatch IS the shape it represents, not a hand-drawn icon standing in for it.
function previewValue(shape: FamilyShapeOption): { property: "border-radius" | "clip-path"; value: string } {
  const corners = Object.fromEntries(
    CORNER_NAMES.map((name) => [name, { h: shape.corners[name].h * PREVIEW_SIZE, v: shape.corners[name].v * PREVIEW_SIZE }])
  ) as Record<CornerName, CornerRadius>;

  return compileBlobValue({
    family: shape.family,
    corners,
    uniform: shape.uniform,
    curvature: shape.curvature,
    surfaceColor: "",
    pageColor: "",
    size: PREVIEW_SIZE,
    selectedCorner: null
  });
}

// Whether a given shape option is the one currently "dialed in" — matched loosely (family + every corner fraction, scaled to the live size) since a shape option itself carries no state of its own to compare identity against.
function isActiveShape(shape: FamilyShapeOption, state: FamilyControlsProps["state"]): boolean {
  if (state.family !== shape.family || state.uniform !== shape.uniform) return false;
  return CORNER_NAMES.every((name) => {
    const expected = { h: shape.corners[name].h * state.size, v: shape.corners[name].v * state.size };
    const actual = state.corners[name];
    return Math.abs(expected.h - actual.h) < 0.5 && Math.abs(expected.v - actual.v) < 0.5;
  });
}

/*
  The tool's other flagship flourish: every quick shape renders as a literal clay-lump swatch
  compiled with the exact border-radius/clip-path it would apply, plus the uniform-corners toggle
  (works for either family — it's about how many fields are editable, not how the corner is drawn)
  and the curvature exponent (squircle-only — a plain rounded corner has no Lamé exponent to speak of).
*/
export default function FamilyControls({ state, actions }: FamilyControlsProps): JSX.Element {
  return (
    <>
      <Panel>
        <PanelHeader>
          <PanelTitle>Shape Lumps</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <FieldWrapper>
            <FieldLabel>Shape</FieldLabel>
            <LumpRow role="radiogroup" aria-label="Quick shape">
              {FAMILY_SHAPES.map((shape) => {
                const { property, value } = previewValue(shape);
                const swatchStyle: CSSProperties = {
                  inlineSize: shape.previewWidth,
                  blockSize: shape.previewHeight,
                  borderRadius: property === "border-radius" ? value : "0",
                  clipPath: property === "clip-path" ? value : "none"
                };

                return (
                  <LumpButton
                    key={shape.id}
                    type="button"
                    role="radio"
                    aria-checked={isActiveShape(shape, state)}
                    data-selected={isActiveShape(shape, state) ? "true" : undefined}
                    onClick={() => actions.applyFamilyShape(shape)}
                  >
                    <LumpStage>
                      <LumpSwatch style={swatchStyle} />
                    </LumpStage>
                    <LumpLabel>{shape.label}</LumpLabel>
                  </LumpButton>
                );
              })}
            </LumpRow>
          </FieldWrapper>

          <UniformRow>
            <CheckboxInput id="blob-uniform" type="checkbox" checked={state.uniform} onChange={(event) => actions.toggleUniform(event.target.checked)} />
            <FieldLabel htmlFor="blob-uniform">Uniform corners</FieldLabel>
          </UniformRow>

          {state.family === "squircle" && (
            <Slider label="Curvature" min={2} max={10} value={state.curvature} onChange={actions.setCurvature} onCommit={actions.commitDrag} />
          )}
        </PanelBody>
      </Panel>
    </>
  );
}

FamilyControls.displayName = "FamilyControls";
