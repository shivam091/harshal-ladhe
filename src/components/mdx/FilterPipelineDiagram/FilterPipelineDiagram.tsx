import type { JSX } from "react";
import { BOX_RADIUS, SOURCE_ALPHA, SOURCE_GRAPHIC, STAGES, MERGE_BOX, MERGE_NODES, OUTPUT } from "@/components/mdx/FilterPipelineDiagram/FilterPipelineDiagram.constants";
import { Wrapper, Svg } from "@/components/mdx/FilterPipelineDiagram/FilterPipelineDiagram.styles";

/*
  Static diagram of the standard coloured drop-shadow chain. Exists to make two facts unmissable: a primitive's
  `result` name is just a label a later primitive picks back up via `in`/`in2`, and the shadow is built from
  SourceAlpha (the silhouette) so it can be given any colour, with SourceGraphic only re-entering at the merge.
*/
export default function FilterPipelineDiagram(): JSX.Element {
  return (
    <>
      <Wrapper>
        <Svg viewBox="0 0 660 480" role="img" aria-labelledby="filter-pipeline-diagram-title filter-pipeline-diagram-desc">
          <title id="filter-pipeline-diagram-title">SVG filter primitive pipeline for a coloured drop shadow</title>
          <desc id="filter-pipeline-diagram-desc">
            SourceAlpha flows into feGaussianBlur, stored as result=&quot;blur&quot;. feOffset reads it and stores
            result=&quot;offsetBlur&quot;. feFlood, which takes no input, paints a solid colour as result=&quot;flood&quot;.
            feComposite with operator=&quot;in&quot; keeps the flood only where offsetBlur has alpha, producing
            result=&quot;shadow&quot;. feMerge stacks two feMergeNode children — shadow first (behind), then
            SourceGraphic (in front) — to produce the final filtered output.
          </desc>

          <defs>
            <marker id="filter-pipeline-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 Z" fill="var(--color-fg-muted)" />
            </marker>
          </defs>

          {/* SourceAlpha — the implicit starting input, drawn as a pill to set it apart from the primitive boxes it feeds. */}
          <rect x={SOURCE_ALPHA.x} y={SOURCE_ALPHA.y} width={SOURCE_ALPHA.width} height={SOURCE_ALPHA.height} rx={SOURCE_ALPHA.height / 2} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={SOURCE_ALPHA.x + SOURCE_ALPHA.width / 2} y={SOURCE_ALPHA.y + SOURCE_ALPHA.height / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">SourceAlpha</text>

          {/* The four primitive boxes before the merge, each spelling out its own in/in2/result values. */}
          {STAGES.map((stage) => (
            <g key={stage.title}>
              <rect x={stage.x} y={stage.y} width={stage.width} height={stage.height} rx={BOX_RADIUS} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
              <text x={stage.x + stage.width / 2} y={stage.y + 24} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">{stage.title}</text>
              {stage.lines.map((line, index) => (
                <text key={line} x={stage.x + stage.width / 2} y={stage.y + 44 + index * 16} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{line}</text>
              ))}
            </g>
          ))}

          {/* Arrow: SourceAlpha → feGaussianBlur, the chain's first "in". */}
          <line x1={136} y1={54} x2={192} y2={54} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />

          {/* Arrow: feGaussianBlur's result="blur" → feOffset. */}
          <line x1={366} y1={54} x2={466} y2={54} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />
          <text x={416} y={44} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">blur</text>

          {/* Arrow: feOffset's result="offsetBlur" → feComposite's in2. */}
          <line x1={555} y1={90} x2={555} y2={146} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />
          <text x={561} y={122} textAnchor="start" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">offsetBlur</text>

          {/* Arrow: feFlood's result="flood" → feComposite's in. */}
          <line x1={366} y1={194} x2={426} y2={194} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />
          <text x={396} y={186} textAnchor="middle" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">flood</text>

          {/* Arrow: feComposite's result="shadow" → feMerge's first feMergeNode. */}
          <line x1={535} y1={238} x2={535} y2={286} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />
          <text x={541} y={266} textAnchor="start" fontSize={10} fontStyle="italic" fill="var(--color-fg-muted)">shadow</text>

          {/* SourceGraphic — the second implicit input, entering only at the merge so its colours stay untouched. */}
          <rect x={SOURCE_GRAPHIC.x} y={SOURCE_GRAPHIC.y} width={SOURCE_GRAPHIC.width} height={SOURCE_GRAPHIC.height} rx={SOURCE_GRAPHIC.height / 2} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={SOURCE_GRAPHIC.x + SOURCE_GRAPHIC.width / 2} y={SOURCE_GRAPHIC.y + SOURCE_GRAPHIC.height / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">SourceGraphic</text>

          {/* Arrow: SourceGraphic → feMerge's second feMergeNode. */}
          <line x1={146} y1={336} x2={186} y2={336} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />

          {/* feMerge — stacks its 2 feMergeNode children in paint order: shadow (behind) first, SourceGraphic (in front) last. */}
          <rect x={MERGE_BOX.x} y={MERGE_BOX.y} width={MERGE_BOX.width} height={MERGE_BOX.height} rx={BOX_RADIUS} fill="var(--color-bg-accent-muted)" stroke="var(--color-border-accent-emphasis)" strokeWidth={1.5} />
          <text x={MERGE_BOX.x + MERGE_BOX.width / 2} y={MERGE_BOX.y + 24} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">feMerge</text>
          {MERGE_NODES.map((node, index) => (
            <text key={node} x={MERGE_BOX.x + MERGE_BOX.width / 2} y={MERGE_BOX.y + 46 + index * 20} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">{node}</text>
          ))}

          {/* Arrow: feMerge → the final filtered output. */}
          <line x1={370} y1={382} x2={370} y2={406} stroke="var(--color-fg-muted)" strokeWidth={2} markerEnd="url(#filter-pipeline-arrow)" />

          {/* Filtered output — the composited result actually painted to the canvas. */}
          <rect x={OUTPUT.x} y={OUTPUT.y} width={OUTPUT.width} height={OUTPUT.height} rx={OUTPUT.height / 2} fill="var(--color-bg-default)" stroke="var(--color-border-default)" strokeWidth={1.5} />
          <text x={OUTPUT.x + OUTPUT.width / 2} y={OUTPUT.y + OUTPUT.height / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={600} fill="var(--color-fg-default)">Filtered output</text>

          <text x={330} y={472} textAnchor="middle" fontSize={11} fill="var(--color-fg-muted)">each result name becomes a later primitive&apos;s in / in2</text>
        </Svg>
      </Wrapper>
    </>
  );
}

FilterPipelineDiagram.displayName = "FilterPipelineDiagram";
