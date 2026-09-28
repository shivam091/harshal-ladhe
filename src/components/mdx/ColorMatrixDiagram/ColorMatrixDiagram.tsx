import type { JSX } from "react";
import { GRID, COLUMNS, ROWS, IDENTITY } from "@/components/mdx/ColorMatrixDiagram/ColorMatrixDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/ColorMatrixDiagram/ColorMatrixDiagram.styles";

// Index of the offset column — styled apart because it adds a constant instead of scaling an input.
const OFFSET_COLUMN = COLUMNS.length - 1;

/*
  Static diagram of feColorMatrix's 4×5 layout: four output-channel rows (R′ G′ B′ A′) by five columns
  (R G B A multipliers plus a constant offset). Exists because the flat, 20-number `values` string hides that
  structure — once each row reads as "one output channel's recipe", hand-writing a matrix stops being guesswork.
*/
export default function ColorMatrixDiagram(): JSX.Element {
  const gridRight = GRID.x + COLUMNS.length * GRID.cellWidth;
  const multiplierRight = GRID.x + OFFSET_COLUMN * GRID.cellWidth;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 620 310" role="img" aria-labelledby="color-matrix-diagram-title color-matrix-diagram-desc">
          <title id="color-matrix-diagram-title">feColorMatrix 4 by 5 matrix layout</title>
          <desc id="color-matrix-diagram-desc">
            A grid with four rows labelled R prime, G prime, B prime and A prime — the output channels — and five columns
            labelled R, G, B, A and offset. The first four columns multiply the input channels; the offset column adds a
            constant. The grid holds the identity matrix: 1 on the diagonal and 0 everywhere else, which leaves colours
            unchanged. Below it, the first row is written out as R prime equals m11 times R plus m12 times G plus m13 times
            B plus m14 times A plus m15.
          </desc>

          {/* Column-group captions: multipliers vs. the additive constant. */}
          <text x={(GRID.x + multiplierRight) / 2} y={30} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">multiplies each input channel</text>
          <line x1={GRID.x + 4} y1={40} x2={multiplierRight - 4} y2={40} stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={(multiplierRight + gridRight) / 2} y={30} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">adds a constant</text>
          <line x1={multiplierRight + 4} y1={40} x2={gridRight - 4} y2={40} stroke="var(--color-border-default)" strokeWidth={1.5} />

          {/* Column headers — input channels, then offset. */}
          {COLUMNS.map((column, columnIndex) => (
            <text key={column} x={GRID.x + columnIndex * GRID.cellWidth + GRID.cellWidth / 2} y={64} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{column}</text>
          ))}
          <text x={GRID.x - 22} y={64} textAnchor="end" fontSize={11} fill="var(--color-fg-muted)">output</text>

          {/* Row labels (output channels) and the identity values, diagonal and offset column tinted. */}
          {ROWS.map((row, rowIndex) => (
            <g key={row}>
              <text x={GRID.x - 22} y={GRID.y + rowIndex * GRID.cellHeight + 25} textAnchor="end" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{row}</text>
              {IDENTITY[rowIndex].map((value, columnIndex) => {
                const isDiagonal = rowIndex === columnIndex;
                const isOffset = columnIndex === OFFSET_COLUMN;
                const fill = isDiagonal ? "var(--color-bg-accent-muted)" : isOffset ? "var(--color-bg-attention-muted)" : "var(--color-bg-default)";
                const stroke = isDiagonal ? "var(--color-border-accent-emphasis)" : isOffset ? "var(--color-border-attention-emphasis)" : "var(--color-border-default)";

                return (
                  <g key={COLUMNS[columnIndex]}>
                    <rect x={GRID.x + columnIndex * GRID.cellWidth} y={GRID.y + rowIndex * GRID.cellHeight} width={GRID.cellWidth} height={GRID.cellHeight} fill={fill} stroke={stroke} strokeWidth={1} />
                    <text x={GRID.x + columnIndex * GRID.cellWidth + GRID.cellWidth / 2} y={GRID.y + rowIndex * GRID.cellHeight + 25} textAnchor="middle" fontSize={13} fill={isDiagonal ? "var(--color-fg-default)" : "var(--color-fg-muted)"}>{value}</text>
                  </g>
                );
              })}
            </g>
          ))}

          {/* One row written out as the equation it encodes. */}
          <text x={310} y={270} textAnchor="middle" fontSize={13} fill="var(--color-fg-default)">R′ = m11·R + m12·G + m13·B + m14·A + m15</text>
          <text x={310} y={294} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">values = 20 numbers, row by row · the identity above changes nothing · offset is in 0–1 units, not 0–255</text>
        </Svg>
      </Wrapper>
    </>
  );
}

ColorMatrixDiagram.displayName = "ColorMatrixDiagram";
