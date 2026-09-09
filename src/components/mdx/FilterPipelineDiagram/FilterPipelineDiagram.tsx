import type { JSX } from "react";
import { BOX_RADIUS, SOURCE_GRAPHIC, STAGES, MERGE_BOX, MERGE_NODES, OUTPUT } from "@/components/mdx/FilterPipelineDiagram/FilterPipelineDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/FilterPipelineDiagram/FilterPipelineDiagram.styles";

/*
  Static SVG diagram of a chained SVG filter pipeline — SourceGraphic feeding a feGaussianBlur, whose
  result="blurred" feeds a feOffset, whose result="offsetBlur" feeds a feMerge alongside SourceGraphic
  itself. Exists to make one fact unmissable: a filter primitive's `result` name is just a label that a
  later primitive can pick back up via `in`/`in2` — that named hand-off is what turns several individually
  simple primitives (blur, offset, merge) into one compound effect (a drop shadow).
*/
export default function FilterPipelineDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 340" role="img" aria-labelledby="filter-pipeline-diagram-title filter-pipeline-diagram-desc">
          <title id="filter-pipeline-diagram-title">SVG filter primitive pipeline diagram</title>
          <desc id="filter-pipeline-diagram-desc">
            SourceGraphic flows into feGaussianBlur, which stores its output as result=&quot;blurred&quot;. feOffset
            reads that as in=&quot;blurred&quot; and stores its own output as result=&quot;offsetBlur&quot;. feMerge then stacks
            two feMergeNode children — offsetBlur first (behind), then SourceGraphic itself (in front) — to
            produce the final filtered output.
          </desc>

          <defs>
            <marker id="filter-pipeline-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* SourceGraphic — the implicit starting input, drawn as a pill to set it apart from the primitive boxes it feeds. */}
          <rect x={SOURCE_GRAPHIC.x} y={SOURCE_GRAPHIC.y} width={SOURCE_GRAPHIC.width} height={SOURCE_GRAPHIC.height} rx={SOURCE_GRAPHIC.height / 2} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={SOURCE_GRAPHIC.x + SOURCE_GRAPHIC.width / 2} y={SOURCE_GRAPHIC.y + SOURCE_GRAPHIC.height / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">SourceGraphic</text>

          {/* feGaussianBlur and feOffset — the 2 chained primitive boxes, each spelling out its own in/result values. */}
          {STAGES.map((stage) => (
            <g key={stage.title}>
              <rect x={stage.x} y={stage.y} width={stage.width} height={stage.height} rx={BOX_RADIUS} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
              <text x={stage.x + stage.width / 2} y={stage.y + 24} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{stage.title}</text>
              {stage.lines.map((line, index) => (
                <text key={line} x={stage.x + stage.width / 2} y={stage.y + 44 + index * 16} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{line}</text>
              ))}
            </g>
          ))}

          {/* Arrow: SourceGraphic → feGaussianBlur, the chain's first "in". */}
          <line x1={160} y1={54} x2={206} y2={54} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />
          <text x={183} y={44} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">SourceGraphic</text>

          {/* Arrow: feGaussianBlur's result="blurred" → feOffset's in. */}
          <line x1={390} y1={54} x2={456} y2={54} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />
          <text x={423} y={44} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">blurred</text>

          {/* Arrow: feOffset's result="offsetBlur" → feMerge's first feMergeNode. */}
          <line x1={550} y1={90} x2={468} y2={164} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />
          <text x={545} y={125} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">offsetBlur</text>

          {/* Arrow: SourceGraphic feeding a second time, directly into feMerge's second feMergeNode. */}
          <path d="M90,82 C90,140 150,140 210,164" fill="none" stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />
          <text x={98} y={122} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">SourceGraphic</text>

          {/* feMerge — stacks its 2 feMergeNode children in paint order: offsetBlur (behind) first, SourceGraphic (in front) last. */}
          <rect x={MERGE_BOX.x} y={MERGE_BOX.y} width={MERGE_BOX.width} height={MERGE_BOX.height} rx={BOX_RADIUS} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={MERGE_BOX.x + MERGE_BOX.width / 2} y={MERGE_BOX.y + 24} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">feMerge</text>
          {MERGE_NODES.map((node, index) => (
            <text key={node} x={MERGE_BOX.x + MERGE_BOX.width / 2} y={MERGE_BOX.y + 46 + index * 20} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{node}</text>
          ))}

          {/* Arrow: feMerge → the final filtered output. */}
          <line x1={330} y1={260} x2={330} y2={284} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />

          {/* Filtered output — the composited result actually painted to the canvas. */}
          <rect x={OUTPUT.x} y={OUTPUT.y} width={OUTPUT.width} height={OUTPUT.height} rx={OUTPUT.height / 2} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={OUTPUT.x + OUTPUT.width / 2} y={OUTPUT.y + OUTPUT.height / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Filtered output</text>

          <text x={330} y={336} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">each result name becomes a later primitive&apos;s in / in2</text>
        </Svg>
      </Wrapper>
    </>
  );
}

FilterPipelineDiagram.displayName = "FilterPipelineDiagram";
