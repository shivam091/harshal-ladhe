import type { JSX } from "react";
import type { GridImplicitPanelProps } from "@/interfaces/grid-implicit-diagram";
import { CELL, GAP } from "@/components/mdx/GridImplicitDiagram/GridImplicitDiagram.constants";

// Renders one panel's cells (explicit or implicit) at the given origin, styling auto-created cells distinctly.
export default function GridImplicitPanel({ originX, originY, cells }: GridImplicitPanelProps): JSX.Element {
  return (
    <>
      {cells.map((cell) => {
        const x = originX + cell.col * (CELL + GAP);
        const y = originY + cell.row * (CELL + GAP);
        return (
          <g key={`${cell.col}-${cell.row}`}>
            <rect
              x={x} y={y} width={CELL} height={CELL} rx={6}
              fill={cell.isNew ? "var(--color-bg-accent-muted)" : "var(--color-bg-muted)"}
              stroke={cell.isNew ? "var(--color-border-accent-emphasis)" : "var(--color-border-default)"}
              strokeWidth={1.5}
              strokeDasharray={cell.isNew ? "5 4" : undefined}
            />
            <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">{cell.label}</text>
          </g>
        );
      })}
    </>
  );
}

GridImplicitPanel.displayName = "GridImplicitPanel";
