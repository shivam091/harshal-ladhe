import type { JSX } from "react";
import {
  PIPELINE_STAGES,
  PIPELINE_ROWS,
  ROW_Y,
  STAGE_LEFT,
  STAGE_W,
  STAGE_GAP,
  STAGE_H,
} from "@/components/mdx/RenderingPipelineDiagram/RenderingPipelineDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/RenderingPipelineDiagram/RenderingPipelineDiagram.styles";

/*
  Static SVG diagram of which rendering stages an entrance re-runs per frame: a height-based entrance lights up
  all four, a transform/opacity one only Style and Composite — the cost difference the post's code pair describes.
*/
export default function RenderingPipelineDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 420 250" role="img" aria-labelledby="rendering-pipeline-title rendering-pipeline-desc">
          <title id="rendering-pipeline-title">Which rendering stages an entrance transition re-runs every frame</title>
          <desc id="rendering-pipeline-desc">
            The pipeline runs Style, Layout, Paint, then Composite. Transitioning height from 0 to 320 pixels re-runs
            all four stages on every frame. Transitioning transform scaleY and opacity instead re-runs only Style and
            Composite, skipping Layout and Paint entirely.
          </desc>

          <defs>
            <marker id="rendering-pipeline-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {PIPELINE_ROWS.map((row, rowIndex) => {
            const y = ROW_Y[rowIndex];
            const color = `var(--color-fg-${row.tone})`;

            return (
              <g key={row.label}>
                <text x={STAGE_LEFT} y={y - 14} fontSize={12} fontWeight={600} fill="var(--color-fg-default)">{row.label}</text>

                {PIPELINE_STAGES.map((stage, stageIndex) => {
                  const x = STAGE_LEFT + stageIndex * (STAGE_W + STAGE_GAP);
                  const isHit = row.stages[stageIndex];

                  return (
                    <g key={stage}>
                      <rect
                        x={x} y={y} width={STAGE_W} height={STAGE_H} rx={6}
                        fill={isHit ? color : "none"} fillOpacity={isHit ? 0.15 : undefined}
                        stroke={isHit ? color : "var(--color-border-muted)"} strokeWidth={isHit ? 2 : 1}
                        strokeDasharray={isHit ? undefined : "4 3"}
                      />
                      <text
                        x={x + STAGE_W / 2} y={y + STAGE_H / 2 + 4} textAnchor="middle" fontSize={11}
                        fontWeight={isHit ? 600 : 400} fill={isHit ? color : "var(--color-fg-muted)"}
                        textDecoration={isHit ? undefined : "line-through"}
                      >
                        {stage}
                      </text>
                      {stageIndex < PIPELINE_STAGES.length - 1 && (
                        <line
                          x1={x + STAGE_W + 3} y1={y + STAGE_H / 2} x2={x + STAGE_W + STAGE_GAP - 3} y2={y + STAGE_H / 2}
                          stroke="var(--color-fg-muted)" strokeWidth={1.5} markerEnd="url(#rendering-pipeline-arrow)"
                        />
                      )}
                    </g>
                  );
                })}

                <text x={210} y={y + STAGE_H + 20} textAnchor="middle" fontSize={10} fill="var(--color-fg-muted)">{row.caption}</text>
              </g>
            );
          })}
        </Svg>
      </Wrapper>
    </>
  );
}

RenderingPipelineDiagram.displayName = "RenderingPipelineDiagram";
