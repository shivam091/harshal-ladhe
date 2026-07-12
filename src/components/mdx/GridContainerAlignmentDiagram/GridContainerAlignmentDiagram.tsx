import type { JSX } from "react";
import type { GridContainerAlignmentDiagramProps } from "@/components/mdx/GridContainerAlignmentDiagram/GridContainerAlignmentDiagram.types";
import {
  CELL_W,
  CELL_H,
  COL_X,
  ROW_Y,
  MARKER_SIZE,
  CONTAINER_X,
  CONTAINER_Y,
  CONTAINER_W,
  CONTAINER_H,
  CONTAINER_ALIGNMENT_CONFIG
} from "@/components/mdx/GridContainerAlignmentDiagram/GridContainerAlignmentDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridContainerAlignmentDiagram/GridContainerAlignmentDiagram.styles";

/*
  Static SVG diagram of one container-level alignment rule (`justify-items`/`align-items`/`place-items`) —
  every cell in the grid gets the same marker position, since these properties apply to all items at once.
*/
export default function GridContainerAlignmentDiagram({ variant }: GridContainerAlignmentDiagramProps): JSX.Element {
  const config = CONTAINER_ALIGNMENT_CONFIG[variant];

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 250" role="img" aria-labelledby={`grid-container-alignment-${variant}-title`}>
          <title id={`grid-container-alignment-${variant}-title`}>
            {variant === "center"
              ? "Diagram of justify-items and align-items set to center: every item sits centered in its cell."
              : "Diagram of place-items set to end start: every item sits at the bottom-left of its cell."}
          </title>

          <rect x={CONTAINER_X} y={CONTAINER_Y} width={CONTAINER_W} height={CONTAINER_H} rx={10} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />

          {ROW_Y.map((y, rowIndex) => (
            COL_X.map((x, colIndex) => (
              <g key={`cell-${rowIndex}-${colIndex}`}>
                <rect x={x} y={y} width={CELL_W} height={CELL_H} fill="none" stroke="var(--color-border-muted)" strokeWidth={1} />
                <rect
                  x={x + config.offsetX} y={y + config.offsetY} width={MARKER_SIZE} height={MARKER_SIZE} rx={4}
                  fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5}
                />
              </g>
            ))
          ))}

          <text x={210} y={CONTAINER_Y + CONTAINER_H + 28} textAnchor="middle" fontSize={12} fill="var(--color-fg-muted)">
            {config.caption}
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

GridContainerAlignmentDiagram.displayName = "GridContainerAlignmentDiagram";
