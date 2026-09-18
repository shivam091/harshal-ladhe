import type { JSX } from "react";
import type { TechniqueControlsProps, TriangleDirection, TriangleTechnique } from "@/interfaces/triangle";
import { FieldWrapper, FieldLabel } from "@/components/InteractiveSvgPanel/DemoControlField/DemoControlField.styles";
import { SegmentRow, SegmentButton, DirectionGrid, DirectionButton, DirectionSpacer } from "@/components/TriangleGenerator/TechniqueControls/TechniqueControls.styles";

const TECHNIQUES: Array<{ value: TriangleTechnique; label: string }> = [
  { value: "border", label: "Border trick" },
  { value: "clip-path", label: "Clip-path" }
];

const SHAPES: Array<{ value: "triangle" | "chevron"; label: string }> = [
  { value: "triangle", label: "Triangle" },
  { value: "chevron", label: "Chevron" }
];

// Compass-point layout: up top-center, left/right on the middle row either side of an empty center cell, down bottom-center — placed via explicit grid-column/row rather than relying on document order, which would otherwise put "left" and "right" on the wrong row.
const DIRECTIONS: Array<{ value: TriangleDirection; glyph: string; column: number; row: number }> = [
  { value: "up", glyph: "▲", column: 2, row: 1 },
  { value: "left", glyph: "◀", column: 1, row: 2 },
  { value: "right", glyph: "▶", column: 3, row: 2 },
  { value: "down", glyph: "▼", column: 2, row: 3 }
];

// Technique (which CSS mechanism builds the shape), direction (which way it points), and — only in clip-path mode, since the border trick can't produce a concave edge — the triangle/chevron shape toggle.
export default function TechniqueControls({ state, actions }: TechniqueControlsProps): JSX.Element {
  return (
    <>
      <FieldWrapper>
        <FieldLabel>Technique</FieldLabel>
        <SegmentRow role="tablist" aria-label="CSS technique">
          {TECHNIQUES.map((technique) => (
            <SegmentButton
              key={technique.value}
              type="button"
              role="tab"
              aria-selected={state.technique === technique.value}
              data-selected={state.technique === technique.value ? "true" : undefined}
              onClick={() => {
                actions.setTechnique(technique.value);
                actions.commitDrag();
              }}
            >
              {technique.label}
            </SegmentButton>
          ))}
        </SegmentRow>
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>Direction</FieldLabel>
        <DirectionGrid>
          <DirectionSpacer style={{ gridColumn: 1, gridRow: 1 }} />
          {DIRECTIONS.map((direction) => (
            <DirectionButton
              key={direction.value}
              type="button"
              aria-label={direction.value}
              aria-pressed={state.direction === direction.value}
              data-selected={state.direction === direction.value ? "true" : undefined}
              style={{ gridColumn: direction.column, gridRow: direction.row }}
              onClick={() => {
                actions.setDirection(direction.value);
                actions.commitDrag();
              }}
            >
              {direction.glyph}
            </DirectionButton>
          ))}
          <DirectionSpacer style={{ gridColumn: 3, gridRow: 1 }} />
          <DirectionSpacer style={{ gridColumn: 2, gridRow: 2 }} />
          <DirectionSpacer style={{ gridColumn: 1, gridRow: 3 }} />
          <DirectionSpacer style={{ gridColumn: 3, gridRow: 3 }} />
        </DirectionGrid>
      </FieldWrapper>

      {state.technique === "clip-path" && (
        <FieldWrapper>
          <FieldLabel>Shape</FieldLabel>
          <SegmentRow role="tablist" aria-label="Shape">
            {SHAPES.map((shape) => (
              <SegmentButton
                key={shape.value}
                type="button"
                role="tab"
                aria-selected={state.shape === shape.value}
                data-selected={state.shape === shape.value ? "true" : undefined}
                onClick={() => {
                  actions.setShape(shape.value);
                  actions.commitDrag();
                }}
              >
                {shape.label}
              </SegmentButton>
            ))}
          </SegmentRow>
        </FieldWrapper>
      )}
    </>
  );
}

TechniqueControls.displayName = "TechniqueControls";
