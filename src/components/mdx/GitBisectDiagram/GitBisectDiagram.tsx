import type { JSX } from "react";
import { DOT_R, COMMIT_X, ROW_Y, BISECT_ROWS } from "@/components/mdx/GitBisectDiagram/GitBisectDiagram.constants";
import { getBisectDotStyle } from "@/components/mdx/GitBisectDiagram/GitBisectDiagram.helpers";
import { Wrapper, Svg } from "@/components/mdx/GitBisectDiagram/GitBisectDiagram.styles";

/*
  Static SVG diagram of `git bisect`'s binary search across 8 commits, narrowing from "commit 1 good, commit
  8 bad" down to the exact first-bad commit over 3 rounds, each testing the midpoint of the current range.
*/
export default function GitBisectDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 400 320" role="img" aria-labelledby="git-bisect-diagram-title">
          <title id="git-bisect-diagram-title">
            Diagram of git bisect narrowing 8 commits down to the first bad one over 3 rounds: testing commit 4
            (bad) narrows the range to 1-4, testing commit 3 (good) narrows it to 3-4, and since those are
            adjacent, commit 4 is confirmed as the first bad commit.
          </title>

          {BISECT_ROWS.map((row, rowIndex) => (
            <g key={rowIndex}>
              <line x1={COMMIT_X[0]} y1={ROW_Y[rowIndex]} x2={COMMIT_X[7]} y2={ROW_Y[rowIndex]} stroke="var(--color-border-muted)" strokeWidth={1.5} />
              {row.states.map((state, commitIndex) => {
                const style = getBisectDotStyle(state);
                return (
                  <g key={commitIndex}>
                    <circle cx={COMMIT_X[commitIndex]} cy={ROW_Y[rowIndex]} r={DOT_R} fill={style.fill} stroke={style.stroke} strokeWidth={1.5} opacity={style.opacity} />
                    {state === "answer" && (
                      <circle cx={COMMIT_X[commitIndex]} cy={ROW_Y[rowIndex]} r={DOT_R + 5} fill="none" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
                    )}
                    <text x={COMMIT_X[commitIndex]} y={ROW_Y[rowIndex] - DOT_R - 8} textAnchor="middle" fontSize={9} fill="var(--color-fg-muted)">{commitIndex + 1}</text>
                    {state === "testing" && (
                      <text x={COMMIT_X[commitIndex]} y={ROW_Y[rowIndex] + DOT_R + 16} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--color-fg-accent)">test</text>
                    )}
                  </g>
                );
              })}
              <text x={200} y={ROW_Y[rowIndex] + 44} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">{row.caption}</text>
            </g>
          ))}

          {/* Legend — good/testing/bad dot colours, left-aligned to the timeline's own left edge (COMMIT_X[0]). */}
          <g fontSize={11}>
            <circle cx={COMMIT_X[0] + 6} cy={294} r={6} fill="var(--color-bg-success-muted)" stroke="var(--color-border-success-emphasis)" strokeWidth={1.5} />
            <text x={COMMIT_X[0] + 20} y={298} fill="var(--color-fg-default)">good</text>

            <circle cx={COMMIT_X[0] + 116} cy={294} r={6} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
            <text x={COMMIT_X[0] + 130} y={298} fill="var(--color-fg-default)">testing</text>

            <circle cx={COMMIT_X[0] + 226} cy={294} r={6} fill="var(--color-bg-danger-muted)" stroke="var(--color-border-danger-emphasis)" strokeWidth={1.5} />
            <text x={COMMIT_X[0] + 240} y={298} fill="var(--color-fg-default)">bad</text>
          </g>
        </Svg>
      </Wrapper>
    </>
  );
}

GitBisectDiagram.displayName = "GitBisectDiagram";
