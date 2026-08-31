import type { JSX } from "react";
import type { GridItemAlignmentDiagramProps } from "@/components/mdx/GridItemAlignmentDiagram/GridItemAlignmentDiagram.types";
import { CELL_X, CELL_Y, CELL_W, CELL_H, MARKER_SIZE, ITEM_ALIGNMENT_CONFIG } from "@/components/mdx/GridItemAlignmentDiagram/GridItemAlignmentDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridItemAlignmentDiagram/GridItemAlignmentDiagram.styles";

/*
  Static SVG diagram of one item-level (self) alignment rule (`justify-self`/`align-self`/`place-self`) —
  a single cell with one item marker positioned per variant, since these properties target one item at a time.
*/
export default function GridItemAlignmentDiagram({ variant }: GridItemAlignmentDiagramProps): JSX.Element {
  const config = ITEM_ALIGNMENT_CONFIG[variant];

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 260 190" role="img" aria-labelledby={`grid-item-alignment-${variant}-title`}>
          <title id={`grid-item-alignment-${variant}-title`}>
            {variant === "top-right"
              ? "Diagram of justify-self: end and align-self: start: the item sits at the top-right of its cell."
              : "Diagram of place-self: end start: the item sits at the bottom-left of its cell."}
          </title>

          <rect x={CELL_X} y={CELL_Y} width={CELL_W} height={CELL_H} rx={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <rect
            x={CELL_X + config.offsetX} y={CELL_Y + config.offsetY} width={MARKER_SIZE} height={MARKER_SIZE} rx={5}
            fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5}
          />

          <text x={CELL_X + CELL_W / 2} y={CELL_Y + CELL_H + 24} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">
            {config.caption}
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

GridItemAlignmentDiagram.displayName = "GridItemAlignmentDiagram";
