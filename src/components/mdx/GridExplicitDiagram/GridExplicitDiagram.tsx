import type { JSX } from "react";
import { CELL, TRACK } from "@/components/mdx/GridExplicitDiagram/GridExplicitDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GridExplicitDiagram/GridExplicitDiagram.styles";

// No cell gets the "auto-created" treatment, because every one was defined by the developer.
export default function GridExplicitDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 250 250" role="img" aria-labelledby="grid-explicit-diagram-title">
          <title id="grid-explicit-diagram-title">
            An explicit 2x2 grid, defined with grid-template-columns and grid-template-rows, holding 4 items —
            Item 1 through Item 4 — one per cell.
          </title>

          {["Item 1", "Item 2", "Item 3", "Item 4"].map((label, index) => {
            const x = TRACK[index % 2];
            const y = TRACK[Math.floor(index / 2)];
            return (
              <g key={label}>
                <rect x={x} y={y} width={CELL} height={CELL} rx={6} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
                <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={12} fill="var(--color-fg-default)">{label}</text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

GridExplicitDiagram.displayName = "GridExplicitDiagram";
