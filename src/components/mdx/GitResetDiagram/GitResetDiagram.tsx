import type { JSX } from "react";
import { CELL_W, CELL_H, COL_X, ROW_Y, AREA_HEADERS, MODE_ROWS } from "@/components/mdx/GitResetDiagram/GitResetDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GitResetDiagram/GitResetDiagram.styles";

/*
  Static SVG diagram of `git reset --soft` / `--mixed` / `--hard`, showing each mode's "blast radius" across
  the three core areas — each mode resets a strict superset of the areas the gentler mode before it resets.
*/
export default function GitResetDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 500 290" role="img" aria-labelledby="git-reset-diagram-title">
          <title id="git-reset-diagram-title">
            Diagram of git reset modes against Working Directory, Staging Area, and Repository. --soft resets
            only the Repository. --mixed also resets the Staging Area. --hard resets all three, including the
            Working Directory.
          </title>

          {/* Column headers, two lines each. */}
          {COL_X.map((x, index) => (
            <g key={`header-${index}`}>
              <text x={x + CELL_W / 2} y={30} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-fg-default)">{AREA_HEADERS[index][0]}</text>
              <text x={x + CELL_W / 2} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--color-fg-default)">{AREA_HEADERS[index][1]}</text>
            </g>
          ))}

          {/* One row per reset mode, with a cell per area showing whether that mode keeps or resets it. */}
          {MODE_ROWS.map((row, rowIndex) => (
            <g key={row.label}>
              <text x={120} y={ROW_Y[rowIndex] + CELL_H / 2 + 4} textAnchor="end" fontSize={11} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-default)">
                {row.label}
              </text>
              {row.states.map((state, colIndex) => (
                <g key={`${row.label}-${colIndex}`}>
                  <rect
                    x={COL_X[colIndex]} y={ROW_Y[rowIndex]} width={CELL_W} height={CELL_H} rx={6}
                    fill={state === "reset" ? "var(--color-bg-danger-muted)" : "var(--color-bg-success-muted)"}
                    stroke={state === "reset" ? "var(--color-border-danger-emphasis)" : "var(--color-border-success-emphasis)"}
                    strokeWidth={1.5}
                  />
                  <text x={COL_X[colIndex] + CELL_W / 2} y={ROW_Y[rowIndex] + CELL_H / 2 + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">
                    {state === "reset" ? "reset" : "kept"}
                  </text>
                </g>
              ))}
            </g>
          ))}

          {/* Legend */}
          <g fontSize={11}>
            <rect x={130} y={250} width={14} height={14} rx={3} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" />
            <text x={150} y={261} fill="var(--color-fg-default)">kept — untouched by this mode</text>

            <rect x={130} y={270} width={14} height={14} rx={3} fill="var(--color-bg-danger-muted)" stroke="var(--color-border-danger-emphasis)" />
            <text x={150} y={281} fill="var(--color-fg-default)">reset — overwritten to match the target commit</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GitResetDiagram.displayName = "GitResetDiagram";
