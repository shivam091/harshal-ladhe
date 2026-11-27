import type { JSX } from "react";
import {
  OLD_X,
  NEW_X,
  BOX_W,
  MARKER_X,
  MARKER_R,
  ROW_START_Y,
  ROW_GAP,
  LEGEND_Y,
  LEGEND_GAP,
  ROWS,
  MARKER_STYLES,
  LEGEND_MARKERS
} from "@/components/mdx/GitRangeDiffDiagram/GitRangeDiffDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GitRangeDiffDiagram/GitRangeDiffDiagram.styles";
import CommitBox from "@/components/mdx/GitRangeDiffDiagram/CommitBox";

/*
  Static SVG diagram of the post's own git range-diff example — each commit from the old version of the branch
  paired with its match in the rebased version, with the marker git prints between them.
*/
export default function GitRangeDiffDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 520 290" role="img" aria-labelledby="git-range-diff-diagram-title">
          <title id="git-range-diff-diagram-title">
            Diagram of git range-diff pairing the old version of feature/login with the rebased one: Add login form
            and Add validation are unchanged (=); Add debug logging exists only in the old version (&lt;); Add rate
            limiting was changed (!) and moved from position 4 to 3; and Add remember-me option exists only in the
            new version (&gt;).
          </title>

          <text x={OLD_X + BOX_W / 2} y={28} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">feature@{"{1}"} (before)</text>
          <text x={NEW_X + BOX_W / 2} y={28} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">feature (after)</text>

          {ROWS.map((row, index) => {
            const y = ROW_START_Y + index * ROW_GAP;
            const style = MARKER_STYLES[row.marker];
            const highlight = row.marker !== "=";

            return (
              <g key={`row-${index}`}>
                {/* Connectors only run to the side(s) the commit actually exists on. */}
                {row.oldLabel !== null && (
                  <line x1={OLD_X + BOX_W} y1={y} x2={MARKER_X - MARKER_R} y2={y} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
                )}
                {row.newLabel !== null && (
                  <line x1={MARKER_X + MARKER_R} y1={y} x2={NEW_X} y2={y} stroke="var(--color-fg-muted)" strokeWidth={1.5} />
                )}

                <CommitBox x={OLD_X} y={y} label={row.oldLabel} marker={row.marker} highlight={highlight} />
                <CommitBox x={NEW_X} y={y} label={row.newLabel} marker={row.marker} highlight={highlight} />

                <circle cx={MARKER_X} cy={y} r={MARKER_R} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} />
                <text x={MARKER_X} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={style.text}>{row.marker}</text>
              </g>
            );
          })}

          {/* Legend — spells out what each marker means. */}
          <g fontSize={10}>
            {LEGEND_MARKERS.map((marker, index) => {
              const style = MARKER_STYLES[marker];
              const x = 30 + index * LEGEND_GAP;

              return (
                <g key={`legend-${marker}`}>
                  <circle cx={x} cy={LEGEND_Y} r={8} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} />
                  <text x={x} y={LEGEND_Y + 3.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={style.text}>{marker}</text>
                  <text x={x + 14} y={LEGEND_Y + 4} fill="var(--color-fg-default)">{style.label}</text>
                </g>
              );
            })}
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GitRangeDiffDiagram.displayName = "GitRangeDiffDiagram";
