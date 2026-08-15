import type { JSX } from "react";
import { BOX_W, BOX_H, BOX_Y, BOX_X, LOOP_Y } from "@/components/mdx/GitCoreModelDiagram/GitCoreModelDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/GitCoreModelDiagram/GitCoreModelDiagram.styles";

// Labels for the three areas, left to right.
const AREA_LABELS = ["Working Directory", "Staging Area", "Repository (.git)"];

/*
  Static SVG diagram of Git's three core areas and how changes flow between them: forward via `git add` and
  `git commit`, and back via `git checkout` / `git restore`.
*/
export default function GitCoreModelDiagram(): JSX.Element {
  const boxCenterY = BOX_Y + BOX_H / 2;

  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 520 230" role="img" aria-labelledby="git-core-model-diagram-title">
          <title id="git-core-model-diagram-title">
            Diagram of Git&apos;s three core areas: Working Directory, Staging Area, and Repository. Forward arrows
            labeled git add and git commit connect them left to right. A looping arrow below, labeled git
            checkout and git restore, connects the Repository back to the Working Directory.
          </title>

          <defs>
            <marker id="core-model-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
            {/* Same arrowhead as above, nudged slightly right of the path's vertex via a lower refY. */}
            <marker id="core-model-arrow-attention" viewBox="0 0 10 10" refX="8" refY="4.5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-attention)" />
            </marker>
          </defs>

          {/* The three area boxes. */}
          {BOX_X.map((x, index) => (
            <g key={AREA_LABELS[index]}>
              <rect x={x} y={BOX_Y} width={BOX_W} height={BOX_H} rx={8} fill="var(--color-bg-muted)" stroke="var(--color-border-default)" strokeWidth={1.5} />
              <text x={x + BOX_W / 2} y={boxCenterY + 4} textAnchor="middle" fontSize={11} fill="var(--color-fg-default)">{AREA_LABELS[index]}</text>
            </g>
          ))}

          {/* Forward arrows: git add, then git commit. */}
          <line x1={BOX_X[0] + BOX_W} y1={boxCenterY} x2={BOX_X[1]} y2={boxCenterY} stroke="var(--color-fg-accent)" strokeWidth={1.5} markerEnd="url(#core-model-arrow)" />
          <text x={(BOX_X[0] + BOX_W + BOX_X[1]) / 2} y={boxCenterY - 8} textAnchor="middle" fontSize={10} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-accent)">git add</text>

          <line x1={BOX_X[1] + BOX_W} y1={boxCenterY} x2={BOX_X[2]} y2={boxCenterY} stroke="var(--color-fg-accent)" strokeWidth={1.5} markerEnd="url(#core-model-arrow)" />
          <text x={(BOX_X[1] + BOX_W + BOX_X[2]) / 2} y={boxCenterY - 8} textAnchor="middle" fontSize={10} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-accent)">git commit</text>

          {/* Reverse arc: git checkout / git restore, looping from Repository back to Working Directory. */}
          <path
            d={`M ${BOX_X[2] + BOX_W / 2},${BOX_Y + BOX_H} C ${BOX_X[2] + BOX_W / 2},${LOOP_Y} ${BOX_X[0] + BOX_W / 2},${LOOP_Y} ${BOX_X[0] + BOX_W / 2},${BOX_Y + BOX_H}`}
            fill="none" stroke="var(--color-fg-attention)" strokeWidth={1.5} markerEnd="url(#core-model-arrow-attention)"
          />
          <text x={(BOX_X[0] + BOX_X[2] + BOX_W) / 2} y={LOOP_Y + 4} textAnchor="middle" fontSize={10} fontFamily="'Source Code Pro', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" fill="var(--color-fg-attention)">
            git checkout / git restore
          </text>
        </Svg>
      </Wrapper>
    </>
  );
}

GitCoreModelDiagram.displayName = "GitCoreModelDiagram";
