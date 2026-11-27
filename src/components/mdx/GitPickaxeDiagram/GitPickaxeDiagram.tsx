import type { JSX } from "react";
import {
  CARD_W, CARD_Y, CARD_H, DIFF_Y, DIFF_STEP, COUNT_Y, RESULT_Y, PICKAXE_CASES
} from "@/components/mdx/GitPickaxeDiagram/GitPickaxeDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GitPickaxeDiagram/GitPickaxeDiagram.styles";

/*
  Static SVG diagram of the post's own MAX_AGE history — the -S/-G difference is easy to misread in prose,
  and seeing a value change and a move slip past -S makes it stick.
*/
export default function GitPickaxeDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 460 250" role="img" aria-labelledby="git-pickaxe-diagram-title">
          <title id="git-pickaxe-diagram-title">
            Diagram comparing git log -S and git log -G for three commits that touch MAX_AGE. Adding the
            constant changes its count from 0 to 1, so both options list the commit. Changing its value from
            3600 to 7200, or moving the line, leaves the count at 1, so only -G lists those commits.
          </title>

          {PICKAXE_CASES.map((pickaxeCase) => {
            const centreX = pickaxeCase.x + CARD_W / 2;
            const results = [
              { label: "-S", matches: pickaxeCase.matchesS },
              { label: "-G", matches: pickaxeCase.matchesG }
            ];

            return (
              <g key={pickaxeCase.title}>
                <rect
                  x={pickaxeCase.x} y={CARD_Y} width={CARD_W} height={CARD_H} rx={8}
                  fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5}
                />
                <text x={centreX} y={CARD_Y + 24} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--color-fg-default)">
                  {pickaxeCase.title}
                </text>

                {pickaxeCase.lines.map((line, index) => (
                  <text
                    key={`${pickaxeCase.title}-${index}`}
                    x={pickaxeCase.x + 14} y={DIFF_Y + index * DIFF_STEP}
                    fontSize={10} xmlSpace="preserve"
                    fill={line.sign === "+" ? "var(--color-fg-success)" : "var(--color-fg-danger)"}
                  >
                    {`${line.sign} ${line.text}`}
                  </text>
                ))}

                <text x={centreX} y={COUNT_Y} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
                  {`count ${pickaxeCase.before} → ${pickaxeCase.after}`}
                </text>

                {results.map((result, index) => (
                  <g key={result.label}>
                    <rect
                      x={pickaxeCase.x + 20} y={RESULT_Y[index] - 13} width={CARD_W - 40} height={19} rx={4}
                      fill={result.matches ? "var(--color-bg-success-muted)" : "var(--color-bg-danger-muted)"}
                      stroke={result.matches ? "var(--color-border-success-emphasis)" : "var(--color-border-danger-emphasis)"}
                      strokeWidth={1}
                    />
                    <text x={centreX} y={RESULT_Y[index]} textAnchor="middle" fontSize={10} fill="var(--color-fg-default)">
                      {`${result.label} ${result.matches ? "lists it" : "skips it"}`}
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          {/* Rule of thumb under the cards — the one-line takeaway the three cards illustrate. */}
          <text x={230} y={236} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">
            -S compares counts; -G matches changed lines
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

GitPickaxeDiagram.displayName = "GitPickaxeDiagram";
